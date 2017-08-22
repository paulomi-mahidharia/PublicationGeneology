package edu.neu.msproject.PulicationGeneology.model;

public class User {

    private int userId;
    private String name;
    private String username;
    private String password;


    public User(String username, String password) {
        super();
        this.username = username;
        this.password = password;
    }

    public User(int userId, String name, String username, String password) {
        super();
        this.userId = userId;
        this.name = name;
        this.username = username;
        this.password = password;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
