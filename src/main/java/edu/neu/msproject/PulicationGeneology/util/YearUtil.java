package edu.neu.msproject.PulicationGeneology.util;


/**
 * YearUtil is used to set the condition for search results according to the year criteria set by user
 *
 * @Given:String,int,int,String
 * @return:A String according to year criteria
 */
public class YearUtil {

    public static String formYearQuery(String type, int start, int end, String tablename) {

        if (start == 0 && end == 0) {
            return null;
        }
        if (type == null) {
            type = "before";
        }

        switch (type) {

            case "after":
                return tablename + ".year > " + start;

            case "before":
                return tablename + ".year < " + end;

            case "between":
                return tablename + ".year BETWEEN " + start + " AND " + end;

            default:
                return tablename + ".year < " + end;
        }

    }

}
