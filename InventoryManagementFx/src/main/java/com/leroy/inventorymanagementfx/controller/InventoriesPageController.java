package com.leroy.inventorymanagementfx.controller;

import com.leroy.inventorymanagementfx.model.User;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.util.StringConverter;

import java.net.URL;
import java.util.ResourceBundle;

public class InventoriesPageController implements Initializable {
    @FXML
    private ListView<String> listView;
    @FXML private TextField searchTerm;
    
    @FXML private TableView<User> myTable;
    @FXML
    private TableColumn<User, String> nameField, emailField;
    @FXML private TableColumn<User, Integer> ageField;
    
    @FXML private ComboBox<String> searchableComboBox;
    private final ObservableList<String> items = FXCollections.observableArrayList(
            "Apple", "Banana", "Cherry", "Date", "Fig", "Grapes", "Mango"
    );
    
    @FXML private Label selectedItem;
    
    private final ObservableList<String> myList = FXCollections.observableArrayList("Dennis",
            "Leroy",
            "Evans",
            "Esther");
    
    private final ObservableList<User> tableList = FXCollections.observableArrayList(
            new User("Dennis", "leroydennisa@gmail.com", 21),
            new User("Leroy", "leroy@gmail.com", 29),
            new User("Evans", "eak@gmail.com", 32),
            new User("Esther", "estherkoranky132@gmail.com", 23)
    );


    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        FilteredList<String> filteredList = new FilteredList<>(myList, p -> true);
        FilteredList<User> filteredUserList = new FilteredList<>(tableList, p -> true);
        
        searchTerm.textProperty().addListener((obs, oldValue, newValue) -> {
            filteredList.setPredicate(item -> {
                if (newValue == null || newValue.isEmpty())
                    return true;
                return item.toLowerCase().contains(newValue.toLowerCase());
                    
            });
            
            filteredUserList.setPredicate(item -> {
                if (newValue == null || newValue.isEmpty())
                    return true;
                return 
                        item.getName().toLowerCase().contains(newValue.toLowerCase()) || 
                        Integer.toString(item.getAge()).contains(newValue) ||
                        item.getEmail().toLowerCase().contains(newValue.toLowerCase());
                        
                    
            });
        });

        nameField.setCellValueFactory(cellData -> cellData.getValue().nameProperty());
        emailField.setCellValueFactory(cellData -> cellData.getValue().emailProperty());
        ageField.setCellValueFactory(cellData -> cellData.getValue().ageProperty().asObject());




        listView.setItems(filteredList);
        SortedList<User> sortedData = new SortedList<>(filteredUserList);
        sortedData.comparatorProperty().bind(myTable.comparatorProperty());
        myTable.setItems(sortedData);
        initializeCombo();
    }

    public void initializeCombo() {
        // Wrap list in a filtered list
        FilteredList<String> filteredItems = new FilteredList<>(items, p -> true);

        // Set the items of the ComboBox
        searchableComboBox.setItems(filteredItems);
        searchableComboBox.setEditable(true);  // still needed for typing/search

// Add listener to commit only if item exists
        searchableComboBox.getEditor().textProperty().addListener((obs, oldVal, newVal) -> {
            FilteredList<String> filtered = (FilteredList<String>) searchableComboBox.getItems();
            boolean matchFound = filtered.stream()
                    .anyMatch(item -> item.equalsIgnoreCase(newVal));

            // Optional: you can prevent non-matching text from being committed
            searchableComboBox.getEditor().setStyle(matchFound ? "" : "-fx-text-inner-color: red;");
        });

// Optional: Reset to null if invalid input is confirmed
        searchableComboBox.getEditor().focusedProperty().addListener((obs, wasFocused, isNowFocused) -> {
            if (!isNowFocused) {
                String text = searchableComboBox.getEditor().getText();
                boolean match = searchableComboBox.getItems().contains(text);
                if (!match) {
                    searchableComboBox.getSelectionModel().clearSelection();
                    searchableComboBox.getEditor().clear();
                }
            }
        });


        // Add listener to the editor (text field)
        searchableComboBox.getEditor().textProperty().addListener((obs, oldValue, newValue) -> {
            final TextField editor = searchableComboBox.getEditor();
            final String selected = searchableComboBox.getSelectionModel().getSelectedItem();
            
            if (!editor.getText().isEmpty())
                searchableComboBox.show();

            // If no selection or text is being edited, filter
            if (selected == null || !selected.equals(editor.getText())) {
                filteredItems.setPredicate(item -> {
                    if (newValue == null || newValue.isEmpty()) return true;
                    return item.toLowerCase().contains(newValue.toLowerCase());
                });
            }
        });

        // Optional: Keep the popup open while typing
        searchableComboBox.setOnKeyPressed(event -> searchableComboBox.show());

        searchableComboBox.setConverter(new StringConverter<>() {
            @Override
            public String toString(String object) {
                return object;
            }

            @Override
            public String fromString(String string) {
                // If the input is in the list, allow it; otherwise reject
                if (items.contains(string)) {
                    return string;
                } else {
                    // Reject invalid entry
                    return null;
                }
            }
        });


    }
    
    public void getItem(ActionEvent event) {selectedItem.setText(searchableComboBox.getSelectionModel().getSelectedItem());}

}
