(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!

    var todo = {};
    var countItemLeft = 0;  // 남은 할 일 갯수
    var $todoList = $('.todo-list');
    var url = "/api/todo";


    // ajax에서 request 보낼 todo object
    function RequestTodo(todo){
        this.todo = todo;
    }

    // todo object
    function ToDo(id, todo, completed, date){
        this.id = id;
        this.todo = todo;
        this.completed = completed;
        this.date = date;
    }

    // todo-list 클래스의 하위 리스트 기본 포맷
    function getTodoListHtml(strCompleted, strChecked, strTodo){
        return '<li' + strCompleted
                + '><div class="view"><input class="toggle" type="checkbox"'
                + strChecked +'><label>' + strTodo
                + '</label><button class="destroy"></button></div><input class="edit" value="Rule the web"></li>';
    }

    // 템플릿 삭제
    function init(){
        $('.todo-list').children($('li')).remove();
    }

    init();

    // 할 일 리스트
    // 페이지가 로드되면, 등록된 할 일 리스트를 보여진다.
    // 최신 할 일이 앞에 보여진다.
    $.get(url, function(data){
        loadTodoAll(data);
     });

    // todoList를 입력받아, todo 데이터를 각 list에 저장하고, todolist에 append한다.
    function loadTodoAll(todoList){
        var i;
        for(i = 0; i<todoList.length; i++){
            todo = new ToDo(todoList[i].id, todoList[i].todo,
                todoList[i].completed, todoList[i].date);
            var strCompleted = "";
            var strChecked = "";

            if(todo.completed === true){
                strCompleted = ' class="completed"';
                strChecked = ' checked';
            } else {
                countItemLeft++;
            }

            $todoList.append(getTodoListHtml(strCompleted, strChecked, todo.todo));
            $todoList.children().last().data("todo", todo); // ToDo 데이터를 현재 추가된 리스트에 입력

            $('.todo-count strong').text(countItemLeft);
        }
    }


    // 할 일 등록하기
    // 할 일을 등록하는 input box가 있다.
    // 커서를 두고 입력한 후 enter키를 누른다.
    // 하단에 페이지 갱신 없이 글이 등록된다.
    // 빈 문자이면 등록되지 않는다.
    // 새로 고침을 해도 같아야 한다.
    $('.new-todo').keypress(function(e) {
        if (e.which == 13) {    // 엔터키 = 13
            var newTodoVal = $('.new-todo').val();  // 입력 값
            if(newTodoVal != ""){
                var requestTodo = new RequestTodo(newTodoVal);  // 입력 값, false(완료X), 현재시간
                var jsonData = JSON.stringify(requestTodo);
                $.ajax({
                    method: "POST",
                    url: "/api/todo",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: jsonData
                }).done(function(data){
                    $('.new-todo').val(''); // input 텍스트 초기화
                    todo = new ToDo(data.id, data.todo, data.completed, data.date);
                    $todoList.prepend(getTodoListHtml("","",todo.todo));    // 리스트 삽입
                    $todoList.children().first().data("todo", todo);    // todo 데이터 저장
                    countItemLeft++;
                    $('.todo-count strong').text(countItemLeft);    // 남은 할 일 갱신
                });
            } else {
                alert("Please write what you need to be done.");
            }
        }
    });

    // 할 일 완료하기
    // 버튼을 클릭 시 이 일은 완료한 일로 상태가 변경된다.
    // 리스트에서 취소선이 그어진다.
    // css의 completed 클래스를 활용한다.
    // 새로 고침을 해도 같아야 한다.
    $('.todo-list').on("click", ".toggle", function(){
        todo = $(this).parents('li').data("todo");
        if($(this).parents('li').hasClass("completed")){
            $(this).parents('li').removeClass( "completed" );
            $(this).prop( "checked", false );
            todo.completed = false;
            countItemLeft++;
        } else {
            $(this).parents('li').addClass( "completed" );
            $(this).prop( "checked", true );
            todo.completed = true;
            countItemLeft--;
        }


        // Put Request를 보낸다. server에서 completed 상태가 갱신된다.
        var jsonData = JSON.stringify(todo);
        $.ajax({
            method: "PUT",
            url: url.concat("/" + todo.id),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: jsonData
        });
    });

    // 할 일 삭제하기
    // 리스트에서 텍스트에 마우스 오버하면 삭제하기(X) 버튼이 보인다.
    // 이 버튼을 클릭하면 해당 글은 삭제되어 리스트에서 페이지 갱신없이 보이지 않는다.
    // 새로 고침을 해도 같아야 한다.
    $('.todo-list').on("click", ".destroy", function(){
        todo = $(this).parents('li').data("todo");
        if(todo.completed === false){
            countItemLeft--;
            $('.todo-count strong').text(countItemLeft);
        }
        deleteTodo(todo);
        $(this).parents('li').remove();
    });


    // todo 삭제 요청 메소드
    function deleteTodo(todo){
        $.ajax({
            method: "DELETE",
            url: url.concat("/" + todo.id)
        });
    }


    // 할 일 전체 갯수 표시
    // 아직 완료하지 못한 할 일의 갯수를 보여준다.
    // 할 일 등록하기, 완료하기, 삭제하기을 할 때 할 일의 갯수는 동기화 되어야 한다.
    // body의 html 요소에 변경이 있을 때마다, todo-count 값을 갱신한다.
    $('body').on("change", function(){
        $('.todo-count strong').text(countItemLeft);
     });


    // 할 일 리스트를 필터링
    // 기본은 ALL로 모든 할 일이 보인다.
    // Active클릭 시 아직 완료하지 못한 일이 보인다
    // Completed를 클릭 시 완료한 일이 보인다.
    // hash가 url에 표현되면 안된다.
    // 필터링할 때는 페이지 갱신이 없어야 한다.
    // 새로 고침을 할 때는 항상 ALL상태로 보인다.
    $('.filters').on("click", "a", function(e){
        e.preventDefault();
        $('.filters a').css("border-color", "transparent");
        $(this).css("border-color","rgba(175, 47, 47, 0.2)");
        var str = $(this).attr("href");
        if(str === "#/active"){
            $('.todo-list li').filter(function(index){
                if($(this).hasClass("completed")){
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        } else if(str === "#/completed"){
            $('.todo-list li').filter(function(index){
                if(!$(this).hasClass("completed")){
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        } else {
            $('.todo-list li').show();
        }
    });

    // 완료한 일 삭제
    // 클릭 시 이미 완료한 일을 리스트에서 삭제한다.
    // 새로 고침을 해도 같아야 한다.
    $('.clear-completed').on('click', function(){
        $('.todo-list li').filter(function(index){
            todo = $(this).data("todo");
            if($(this).hasClass("completed")){
                deleteTodo(todo);
                $(this).remove();
            }
        });
    });
})(window);
