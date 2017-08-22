package edu.neu.msproject.PulicationGeneology.util;


/**
 * This class is used defined publicationUtil which are use to set constraints in a query String
 *
 * @Given:A string, string, boolean
 * @return:A string.
 */
public class PublicationUtil {

    public static String publicationQuery(String tableName, String conference, boolean isPublished) {

        String constraint = isPublished ? "IN" : "NOT IN";
        return tableName + ".conference_name " + constraint + " (" + conference + ")";
    }

    public static String conferenceQuery(String tableName, String conference, boolean isPublished) {

        String constraint = isPublished ? "IN" : "NOT IN";
        return tableName + ".name " + constraint + " (" + conference + ")";
    }
}
