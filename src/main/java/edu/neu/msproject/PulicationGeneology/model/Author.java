package edu.neu.msproject.PulicationGeneology.model;

import java.util.List;

public class Author implements Comparable<Author> {

	private int authorId;
	private String authorKey;
	private String name;
	private int age;
	private String degree;
	private String gender;
	private String country;
	private String url;
	private String affiliation;
	private List<String> aliasNames;
	private List<AuthorPaper> papers;
	private List<Conference> conferences;

	public int getAuthorId() {
		return authorId;
	}

	public void setAuthorId(int authorId) {
		this.authorId = authorId;
	}

	public String getAuthorKey() {
		return authorKey;
	}

	public void setAuthorKey(String authorKey) {
		this.authorKey = authorKey;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getDegree() {
		return degree;
	}

	public void setDegree(String degree) {
		this.degree = degree;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getAffiliation() {
		return affiliation;
	}

	public void setAffiliation(String affiliation) {
		this.affiliation = affiliation;
	}

	public List<String> getAliasNames() {
		return aliasNames;
	}

	public void setAliasNames(List<String> aliasNames) {
		this.aliasNames = aliasNames;
	}

	@Override
	public boolean equals(Object obj) {
		Author a;
		try{
			a = (Author) obj;
		}catch(Exception e){
			System.out.println("Error in casting object o to Author");
			return false;
		}
		return this.authorId == a.getAuthorId();
	}

	@Override
	public int compareTo(Author o) {
		return getName().compareTo(o.getName());
	}

	public List<AuthorPaper> getPapers() {
		return papers;
	}

	public void setPapers(List<AuthorPaper> papers) {
		this.papers = papers;
	}

	public List<Conference> getConferences() {
		return conferences;
	}

	public void setConferences(List<Conference> conferences) {
		this.conferences = conferences;
	}

}
