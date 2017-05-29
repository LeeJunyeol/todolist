package kr.or.connect.todo.domain;

import java.sql.Timestamp;

public class ToDo {
	private Integer id;
	private String todo;
	private Boolean completed;
	private Timestamp date;

	public ToDo() {
		super();
	}

	public ToDo(String todo) {
		super();
		this.todo = todo;
	}
	
	public ToDo(String todo, Boolean completed, Timestamp date) {
		super();
		this.todo = todo;
		this.completed = completed;
		this.date = date;
	}

	public ToDo(Integer id, String todo, Boolean completed, Timestamp date) {
		super();
		this.id = id;
		this.todo = todo;
		this.completed = completed;
		this.date = date;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String gettodo() {
		return todo;
	}

	public void settodo(String todo) {
		this.todo = todo;
	}

	public Boolean getCompleted() {
		return completed;
	}

	public void setCompleted(Boolean completed) {
		this.completed = completed;
	}

	public Timestamp getDate() {
		return date;
	}

	public void setDate(Timestamp date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "ToDo [id=" + id + ", todo=" + todo + ", completed=" + completed + ", date=" + date + "]";
	}

}
// id INT IDENTITY NOT NULL PRIMARY KEY AUTO_INCREMENT,
// todo TEXT,
// completed INT(1) NOT NULL DEFAULT 0,
// date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
