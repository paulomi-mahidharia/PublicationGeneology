package edu.neu.msproject.PulicationGeneology.util;


/**
 * This class returns a string to search according to title
 * @Given:A String,String,Boolean
 * @return:A String	
 */
public class TitleUtil {

	public static String titleQuery(String title, String tableName,boolean contains){
		return tableName + ".title LIKE '%" +  title + "%'" ;
	}
	
	
}
