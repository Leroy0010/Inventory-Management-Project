package com.leroy.inventorymanagementfx.customcontrols;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.ComboBox;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.util.Callback;
import javafx.util.StringConverter;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * A custom ComboBox that provides multi-selection and filtering capabilities.
 * It's designed to simulate a multi-select dropdown with a search feature.
 * When an item is selected, it's added to a list of selected items and removed from the dropdown.
 * When the user types, the dropdown filters its available options.
 *
 * @param <T> The type of the items in the ComboBox.
 */
public class FilteredComboBox<T> extends ComboBox<T> {

    private final ObservableList<T> originalItems = FXCollections.observableArrayList();
    private final ObservableList<T> filteredItems = FXCollections.observableArrayList();
    private final Set<T> selectedItems = new HashSet<>();
    private final TextField editor; // The editable TextField of the ComboBox

    public FilteredComboBox() {
        setEditable(true);
        editor = getEditor();



        // Custom string converter (can be overridden by the user)
        // Default behavior for String type
        // The check 'T.class == String.class' causes "Cannot access class object of a type parameter"
        // It's better to provide a default StringConverter and let the user override if needed.
        // For a generic class, you generally can't do T.class directly.
        setConverter(new StringConverter<>() {
            @Override
            public String toString(T object) {
                return object == null ? "" : object.toString();
            }

            @Override
            public T fromString(String string) {
                // This method is primarily for parsing user input back to an object.
                // For a multi-select filter, it might not be directly used for dropdown items.
                // It's crucial if you allow arbitrary text input that can become a new item.
                // For existing items, you'd typically find them in originalItems.
                return originalItems.stream()
                        .filter(item -> toString(item).equals(string))
                        .findFirst()
                        .orElse(null);
            }
        });
        
        

        // Store original items when they are set
        itemsProperty().addListener((obs, oldVal, newVal) -> {
            if (newVal != null) {
                originalItems.setAll(newVal);
                filteredItems.setAll(newVal);
                super.setItems(filteredItems); // Set the filtered list as the actual items
                updateDisplay();
            }
        });

        // Set a custom cell factory to display selected items properly and handle selection
        setCellFactory(new Callback<>() {
            @Override
            public ListCell<T> call(ListView<T> param) {
                return new ListCell<>() {
                    @Override
                    protected void updateItem(T item, boolean empty) {
                        super.updateItem(item, empty);
                        if (empty || item == null) {
                            setText(null);
                        } else {
                            // Use the ComboBox's StringConverter to display the item
                            // This is the correct way to get the converter associated with this ComboBox
                            setText(getConverter().toString(item)); // Corrected line
                        }
                    }
                };
            }
        });

        // Handle text input for filtering
        editor.textProperty().addListener((obs, oldText, newText) -> {
            filterItems(newText);
            // Only show if there's text or if the dropdown was explicitly closed and needs to reopen
            if (!newText.isEmpty() || !isShowing()) {
                show();
            }
        });

        // Handle item selection from dropdown
        getSelectionModel().selectedItemProperty().addListener((obs, oldVal, newItem) -> {
            if (newItem != null && !selectedItems.contains(newItem)) {
                selectedItems.add(newItem);
                originalItems.remove(newItem); // Remove from original so it's not re-added to options
                filteredItems.remove(newItem); // Remove from filtered list
                editor.clear(); // Clear text field after selection
                updateDisplay();
                setValue(null); // Clear the selected value in the combo box itself
                hide(); // Hide the dropdown after selection
            }
        });

        // Handle backspace to remove last selected item
        editor.addEventFilter(KeyEvent.KEY_PRESSED, event -> {
            if (event.getCode() == KeyCode.BACK_SPACE && editor.getText().isEmpty() && !selectedItems.isEmpty()) {
                // To get the "last added" item from a Set, we need to convert it to an ordered collection
                // This approach ensures we always remove *some* item if multiple are selected,
                // but for true "last added", a LinkedHashSet or List would be more robust.
                // For a typical UI, removing any of the selected items might be acceptable if order isn't critical.
                T itemToRemove = selectedItems.iterator().next(); // Simply get the first element for removal
                if (itemToRemove != null) {
                    selectedItems.remove(itemToRemove);
                    originalItems.add(itemToRemove); // Add back to original list
                    updateDisplay();
                }
                event.consume(); // Consume the event to prevent default backspace behavior
            }
        });

        // Ensure the dropdown shows when typing if not already visible
        editor.focusedProperty().addListener((obs, oldVal, newVal) -> {
            if (newVal && !isShowing()) {
                show();
            }
        });

        // Make sure the editor is always visible for typing
        editor.setManaged(true);
        editor.setVisible(true);

    }

    private void filterItems(String searchText) {
        // Only filter from items that are NOT already selected
        ObservableList<T> availableToFilter = FXCollections.observableArrayList(originalItems.stream()
                .filter(item -> !selectedItems.contains(item))
                .collect(Collectors.toList()));

        if (searchText == null || searchText.isEmpty()) {
            filteredItems.setAll(availableToFilter); // Show all available items
        } else {
            String lowerCaseSearchText = searchText.toLowerCase();
            filteredItems.setAll(availableToFilter.stream()
                    .filter(item -> getConverter().toString(item).toLowerCase().contains(lowerCaseSearchText)) // Corrected line
                    .collect(Collectors.toList()));
        }
        super.setItems(filteredItems); // Update the displayed items
    }

    private void updateDisplay() {
        filterItems(editor.getText()); // Re-filter to reflect changes in originalItems
    }

    public Set<T> getSelectedItems() {
        return new HashSet<>(selectedItems); // Return a copy to prevent external modification
    }

    public void clearSelection() {
        selectedItems.clear();
        // Restore all original items to the pool.
        // This assumes that `setAllItems` correctly populates `originalItems`
        // with the complete initial set of available items.
        // If `originalItems` doesn't hold the full master list, you might need to reload it.
        filterItems(""); // Reset filter to show all initially available
        editor.clear();
    }

    // Renamed from setItems to setAllItems to avoid confusion with ComboBox's setItems
    // and to clarify its purpose: setting the master list of all available items.
    public void setAllItems(ObservableList<T> value) {
        originalItems.setAll(value); // Set original items
        filteredItems.setAll(value); // Initialize filtered items
        selectedItems.clear(); // Clear any previous selections
        super.setItems(filteredItems); // Set the combobox to use the filtered items list
        updateDisplay(); // Ensure display is updated
    }
}