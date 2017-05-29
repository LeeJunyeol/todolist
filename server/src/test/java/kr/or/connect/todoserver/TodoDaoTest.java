package kr.or.connect.todoserver;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Collection;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import kr.or.connect.todo.TodoApplication;
import kr.or.connect.todo.domain.ToDo;
import kr.or.connect.todo.persistence.TodoDao;

@RunWith(SpringRunner.class)
@SpringBootTest(classes=TodoApplication.class)
@Transactional
public class TodoDaoTest {

	@Autowired
	private TodoDao dao;
	
	@Test
	public void shouldInsertAndSelect() {
		Calendar calendar = Calendar.getInstance();
		Timestamp currentTimestamp = new Timestamp(calendar.getTime().getTime());
		// given
		ToDo todo = new ToDo("할 일", true, currentTimestamp);

		// when
		Integer id = dao.insert(todo);

		// then
		ToDo selected = dao.selectById(id);
		System.out.println(selected);
		assertThat(selected.gettodo(), is("할 일"));
	}
	
	@Test
	public void shouldDelete(){
		Calendar calendar = Calendar.getInstance();
		Timestamp currentTimestamp = new Timestamp(calendar.getTime().getTime());
		// given
		ToDo todo = new ToDo("할 일", true, currentTimestamp);
		Integer id = dao.insert(todo);

		// when
		int affected = dao.deleteById(id);

		// Then
		assertThat(affected, is(1));
	}
	
	@Test
	public void shouldUpdate() {
		Calendar calendar = Calendar.getInstance();
		Timestamp currentTimestamp = new Timestamp(calendar.getTime().getTime());
		// given
		ToDo todo = new ToDo("할 일", true, currentTimestamp);
		Integer id = dao.insert(todo);

		// When
		todo.setId(id);
		todo.settodo("할일업데이트");
		int affected = dao.update(todo);

		// Then
		assertThat(affected, is(1));
		ToDo updated = dao.selectById(id);
		assertThat(updated.gettodo(), is("할일업데이트"));
	}
}
