package edu.neu.msproject.PulicationGeneology.util;

import javafx.event.Event;
import javafx.event.EventHandler;
import javafx.scene.Cursor;
import javafx.scene.Node;

public class HandCursor {

    public static void showHandCursor(Node btn) {

        if (btn != null) {
            btn.setOnMouseEntered(new EventHandler() {
                @Override
                public void handle(Event event) {

                    btn.setCursor(Cursor.HAND); //Change cursor to hand
                }
            });
        }
    }
}
