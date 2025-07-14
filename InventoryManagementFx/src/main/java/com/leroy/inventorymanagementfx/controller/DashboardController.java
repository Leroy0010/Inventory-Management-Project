package com.leroy.inventorymanagementfx.controller;

import com.dlsc.formsfx.model.structure.Field;
import com.dlsc.formsfx.model.structure.Form;
import com.dlsc.formsfx.model.structure.Group;
import com.dlsc.formsfx.model.validators.CustomValidator;
import com.dlsc.formsfx.model.validators.IntegerRangeValidator;
import com.dlsc.formsfx.model.validators.StringLengthValidator;
import com.dlsc.formsfx.view.renderer.FormRenderer;
import com.leroy.inventorymanagementfx.model.User;
import eu.hansolo.tilesfx.Tile;
import eu.hansolo.tilesfx.TileBuilder;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

import java.net.URL;
import java.util.ResourceBundle;

public class DashboardController implements Initializable {
    @FXML private HBox dashboardContainer;
    @FXML private VBox formContainer;


    private final User user = new User();


    @Override
    public void initialize(URL location, ResourceBundle resources) {
        setupDashboard();
        setupForm();

    }

    private void setupDashboard() {
        // Create TilesFX dashboard
        Tile tempTile = TileBuilder.create()
                .skinType(Tile.SkinType.GAUGE2)
                .title("Temperature")
                .unit("°C")
                .minValue(-20)
                .maxValue(50)
                .value(22)
                .build();

        Tile statsTile = TileBuilder.create()
                .skinType(Tile.SkinType.SMOOTHED_CHART)
                .title("Usage")
                .animated(true)
                .build();

        // Set dark theme for all tiles
        
        dashboardContainer.getChildren().addAll(tempTile, statsTile);
    }

    private void setupForm() {
        // FormsFX form
        Form form = Form.of(
                Group.of(
                        Field.ofStringType(user.nameProperty())
                                .label("Name")
                                .validate(
                                        StringLengthValidator.between(3, 30, "Name must be 3-30 characters")
                                )
                                
                        ,
                        Field.ofStringType(user.emailProperty())
                                .label("Email")
                                .validate(CustomValidator.forPredicate(
                                        email -> email != null && email.contains("@"),
                                        "Email must contain @"
                                )),
                                
                        Field.ofIntegerType(user.ageProperty())
                                .label("Age")
                                .validate(IntegerRangeValidator.between(18, 99, "Age must be 18-99"))
                )).title("User Registration");

        FormRenderer formRenderer = new FormRenderer(form);
        formRenderer.setStyle("-fx-border-color: transparent; -fx-border-width: 0;");
        formRenderer.getStyleClass().add("form-renderer");

        formContainer.getChildren().add(formRenderer);
        
    }
    
    

}