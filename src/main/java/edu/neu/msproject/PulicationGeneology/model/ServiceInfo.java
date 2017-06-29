package edu.neu.msproject.PulicationGeneology.model;

import java.util.Date;

public class ServiceInfo {

	private boolean hasServed;
	private String conferenceName;
	private String position;
	private String options;
	private int startDate;
	private int endDate;
	
	public ServiceInfo(boolean hasServed, String conferenceName, String position, String options, int startDate,
			int endDate) {
		super();
		this.hasServed = hasServed;
		this.conferenceName = conferenceName.toLowerCase();
		this.position = position;
		this.options = options;
		this.startDate = startDate;
		this.endDate = endDate;
	}
	
	public ServiceInfo() {
		// TODO Auto-generated constructor stub
	}

	public boolean isHasServed() {
		return hasServed;
	}
	public void setHasServed(boolean hasServed) {
		this.hasServed = hasServed;
	}
	public String getConferenceName() {
		return conferenceName;
	}

	public void setConferenceName(String conferenceName) {
		this.conferenceName = conferenceName;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}
	public int getStartDate() {
		return startDate;
	}
	public void setStartDate(int startDate) {
		this.startDate = startDate;
	}
	public int getEndDate() {
		return endDate;
	}
	public void setEndDate(int endDate) {
		this.endDate = endDate;
	}
	public String getOptions() {
		return options;
	}
	public void setOptions(String options) {
		this.options = options;
	}
}
