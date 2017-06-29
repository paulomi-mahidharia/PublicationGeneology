package edu.neu.msproject.PulicationGeneology.util;



/**
 * This class is use to generate query string according to criteria 
 * This class methods
 * equalCriteriaQuery
 * @Given: tableName,columnName,value
 * @return:A String
 * notEqualCriteriaQuery
 * @Given:String,String,String
 * @return:String
 *
 */
public class CriteriaUtil {

	public static String equalCriteriaQuery(String tableName, String columnName, String value){
		
		return tableName+"."+ columnName + " = " + "'" + value + "'";
	}
	
	public static String notEqualCriteriaQuery(String tableName, String columnName, String value){
		
		return tableName+"."+ columnName + " <> " + "'" + value + "'";
	}
	
	public static String containsCriteriaQuery(String tableName, String columnName, String value){
		
		return tableName+"."+ columnName + " LIKE " + "'%" + value + "%'";
	}
	
	public static String orderByCriteriaQuery(String tableName, String columnName, String order){
		
		return "order by " + tableName+"."+ columnName + " " + order;
	}
}
