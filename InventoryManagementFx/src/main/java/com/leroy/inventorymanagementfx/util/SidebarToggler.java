package com.leroy.inventorymanagementfx.util;

import javafx.animation.FadeTransition;
import javafx.animation.ParallelTransition;
import javafx.animation.TranslateTransition;
import javafx.scene.Node;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.Region;
import javafx.util.Duration;

public class SidebarToggler {
    public static void toggleSidebar(BorderPane rootLayout) {
        Node leftPane = rootLayout.getLeft();

        // Get the width from the bounds (works even if not laid out yet)
        double width = leftPane.getBoundsInLocal().getWidth();

        // If width is 0 (first run), use preferred width
        if (width <= 0) {
            width = ((Region)leftPane).getPrefWidth();
        }

        TranslateTransition slide = new TranslateTransition(Duration.millis(300), leftPane);
        FadeTransition fade = new FadeTransition(Duration.millis(300), leftPane);

        if (leftPane.isVisible()) {
            // Hide animation
            slide.setToX(-width);
            fade.setToValue(0);
            slide.setOnFinished(e -> {
                leftPane.setVisible(false);
                leftPane.setManaged(false);
                leftPane.setTranslateX(0); // Reset for next show
            });
        } else {
            // Show animation
            leftPane.setTranslateX(-width); // Start from hidden position
            leftPane.setVisible(true);
            leftPane.setManaged(true);
            slide.setToX(0);
            fade.setFromValue(0);
            fade.setToValue(1);
        }

        new ParallelTransition(slide, fade).play();
    }

}
