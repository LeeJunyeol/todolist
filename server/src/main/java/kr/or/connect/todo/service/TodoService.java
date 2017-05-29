package kr.or.connect.todo.service;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

import kr.or.connect.todo.domain.ToDo;
import kr.or.connect.todo.persistence.TodoDao;

@Service
public class TodoService {
	private TodoDao dao;
	
	public TodoService(TodoDao dao) {
		super();
		this.dao = dao;
	}

	public ToDo findById(Integer id){
		return dao.selectById(id);
	}
	
	public Collection<ToDo> findAll(){
		return dao.selectAll();
	}
	
	public ToDo create(ToDo todo){
		Integer id = dao.insert(todo);
		todo.setId(id);
		
		return todo;
	}
	
	public boolean update(ToDo todo){
		int affected = dao.update(todo);
		return affected == 1;
	}
	
	public boolean delete(Integer id){
		int affected = dao.deleteById(id);
		return affected == 1;
	}
}
