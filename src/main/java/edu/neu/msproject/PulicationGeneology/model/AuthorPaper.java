package edu.neu.msproject.PulicationGeneology.model;

public class AuthorPaper {

	private int paperId;
	private String confName;
	private String paperTitle;
	private int year;
	private String url;
	
	public int getPaperId() {
		return paperId;
	}
	public void setPaperId(int paperId) {
		this.paperId = paperId;
	}
	public String getConfName() {
		return confName;
	}
	public void setConfName(String confName) {
		this.confName = confName;
	}
	public String getPaperTitle() {
		return paperTitle;
	}
	public void setPaperTitle(String paperTitle) {
		this.paperTitle = paperTitle;
	}
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	
}
