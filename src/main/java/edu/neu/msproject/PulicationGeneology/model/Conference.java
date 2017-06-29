package edu.neu.msproject.PulicationGeneology.model;

public class Conference {
	
	private int conferenceId;
	private int year;
	private String conferenceKey;
	private String name;
	private String title;
	private String isbn;
	
	public int getConferenceId() {
		return conferenceId;
	}
	public void setConferenceId(int conferenceId) {
		this.conferenceId = conferenceId;
	}
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public String getConferenceKey() {
		return conferenceKey;
	}
	public void setConferenceKey(String conferenceKey) {
		this.conferenceKey = conferenceKey;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getIsbn() {
		return isbn;
	}
	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}
	
}
