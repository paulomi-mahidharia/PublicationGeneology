package edu.neu.msproject.PulicationGeneology.util;


/**
 * This class is used to generate group by  query according tablename,groupByColumn,countByColumn
 *
 * @Given:Integer,String,String
 * @return:A string
 */
public class GroupByUtil {

    public static String groupByQuery(String tablename, int numOfPapers, String groupByColumn, String countByColumn) {
        String query = " GROUP BY " + tablename + "." + groupByColumn + " HAVING COUNT(" + tablename + "."
                + countByColumn + ") >= " + numOfPapers;
        return query;
    }
}
