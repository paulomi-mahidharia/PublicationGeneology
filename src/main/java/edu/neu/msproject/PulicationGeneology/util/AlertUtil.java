package edu.neu.msproject.PulicationGeneology.util;

import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;


/**
 * The below static method is used to display Alert messages
 *
 * @Given:A title, header, description
 * @returns:This is a void method.
 */
@SuppressWarnings({"restriction"})
public class AlertUtil {
    public static void displayAlert(String title, String header, String description) {
        //Display Error Message
        Alert alert = new Alert(AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(description);

        alert.showAndWait();
    }
}
