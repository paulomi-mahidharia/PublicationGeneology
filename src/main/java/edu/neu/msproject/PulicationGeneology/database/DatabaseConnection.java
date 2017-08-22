package edu.neu.msproject.PulicationGeneology.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;


/**
 * This class is use to set database connection with aws RDS or local db
 * This class is a singleton class and implements singletons design pattern
 */
public class DatabaseConnection {

    private static Properties prop = new Properties();
    private static String dbUrl;

    private static String user;
    private static String password;

    private static Connection connection;

    static {
        try {
            prop.load(DatabaseConnection.class.getClassLoader().getResourceAsStream("config.properties"));
            dbUrl = prop.getProperty("aws.db.connection.url");
            user = prop.getProperty("aws.db.username");
            password = prop.getProperty("aws.db.password");

        } catch (Exception e) {
            System.out.println("Unable to read Properties file");
        }
    }

	/*public static void main(String args[]) throws SQLException{
        Connection conn = getConn();
		String queryString = "SELECT * FROM author WHERE author.id = "+1048959;
		PreparedStatement stmt = conn.prepareStatement(queryString);
		ResultSet rs = stmt.executeQuery();
		while (rs.next()){
			System.out.println(rs.getString(1));
		}
	}*/

    public static Connection getConn() {
        synchronized (DatabaseConnection.class) {
            try {
                if (connection == null || connection.isClosed()) {
                    connectToDB();
                }
            } catch (SQLException e) {
                System.out.println("Error while connecting to database server: " + e.getMessage());
                e.printStackTrace();
            }
        }
        return connection;
    }

    private static void connectToDB() {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection(dbUrl, user, password);
        } catch (Exception e) {
            System.out.println("Error while opening a conneciton to database server: "
                    + e.getMessage());
            return;
        }
    }
} 
