/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;
function fetchCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("List the todo items Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Adding a Todo Item responds with json at /todos", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
    // expect(response.header["content-type"]).toBe(
    //   "application/json; charset=utf-8"
    // );

    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();
  });

  test("Mark a todo as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    const getResponse = await agent.get("/todos");
    let csrfToken = fetchCsrfToken(getResponse);
    await agent.post("/todos").send({
      title: "copyright year has been changed successfully",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const TodosItems = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const TodosItemsParse = JSON.parse(TodosItems.text);
    const calculateTodosTodayITem = TodosItemsParse.dueToday.length;
    const Todo = TodosItemsParse.dueToday[calculateTodosTodayITem - 1];
    const boolStatus = Todo.completed ? false : true;
    const anotherRes = await agent.get("/todos");
    csrfToken = fetchCsrfToken(anotherRes);

    const changeTodo = await agent
      .put(`/todos/${Todo.id}`)
      .send({ _csrf: csrfToken, completed: boolStatus });

    const UpadteTodoItemParse = JSON.parse(changeTodo.text);
    expect(UpadteTodoItemParse.completed).toBe(true);

    // const agent = request.agent(server);
    // await login(agent, "user.a@test.com", "12345678");
    // let res = await agent.get("/todos");
    // let csrfToken = extractCsrfToken(res);
    // await agent.post("/todos").send({
    //   title: "Buy Milk",
    //   dueDate: new Date().toISOString(),
    //   completed: false,
    //   _csrf: csrfToken,
    // });
    // const groupedTodosResponse = await agent
    //   .get("/todos")
    //   .set("Accept", "application/json");
    // const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    // const dueTodayCount = parsedGroupedResponse.dueToday.length;
    // const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    // res = await agent.get("/todos");
    // csrfToken = extractCsrfToken(res);

    // const markCompleteResponse = await agent
    //   .put(`/todos/${latestTodo.id}`)
    //   .send({
    //     _csrf: csrfToken,
    //     completed: false,
    //   });
    // const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    // expect(parsedUpdateResponse.completed).toBe(true);

    // const parsedResponse = JSON.parse(response.text);
    // const todoID = parsedResponse.id;

    // expect(parsedResponse.completed).toBe(false);

    // const markCompleteResponse = await agent
    //   .put(`/todos/${todoID}/markAsCompleted`)
    //   .send();
    // const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    // expect(parsedUpdateRespose.completed).toBe(true);
  });

  // test("Mark a todo as incomplete", async () => {
  //   const agent = request.agent(server);
  //   await login(agent, "user.a@test.com", "12345678");
  //   let res = await agent.get("/todos");
  //   let csrfToken = extractCsrfToken(res);
  //   await agent.post("/todos").send({
  //     title: "Buy Milk",
  //     dueDate: new Date().toISOString(),
  //     completed: true,
  //     _csrf: csrfToken,
  //   });
  //   const groupedTodosResponse = await agent
  //     .get("/todos")
  //     .set("Accept", "application/json");
  //   const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
  //   const dueTodayCount = parsedGroupedResponse.dueToday.length;
  //   const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
  //   res = await agent.get("/todos");
  //   csrfToken = extractCsrfToken(res);

  //   const markInCompleteResponse = await agent
  //     .put(`/todos/${latestTodo.id}`)
  //     .send({
  //       _csrf: csrfToken,
  //       completed: true,
  //     });
  //   const parsedUpdateResponse = JSON.parse(markInCompleteResponse.text);
  //   expect(parsedUpdateResponse.completed).toBe(false);
  // });

  test("Test the marking an item as incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    const getResponse = await agent.get("/todos");
    let csrfToken = fetchCsrfToken(getResponse);
    await agent.post("/todos").send({
      title: "some changes of L9-1-1-1",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const TodosItems = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const TodosItemsParse = JSON.parse(TodosItems.text);
    const calculateTodosTodayITem = TodosItemsParse.dueToday.length;
    const Todo = TodosItemsParse.dueToday[calculateTodosTodayITem - 1];
    const boolStatus = !Todo.completed;
    let anotherRes = await agent.get("/todos");
    csrfToken = fetchCsrfToken(anotherRes);

    var changeTodo = await agent
      .put(`/todos/${Todo.id}`)
      .send({ _csrf: csrfToken, completed: true });

    const UpadteTodoItemParse = JSON.parse(changeTodo.text);
    expect(UpadteTodoItemParse.completed).toBe(true);

    anotherRes = await agent.get("/todos");
    csrfToken = fetchCsrfToken(anotherRes);

    const changeTodo2 = await agent
      .put(`/todos/${Todo.id}`)
      .send({ _csrf: csrfToken, completed: false });

    const UpadteTodoItemParse2 = JSON.parse(changeTodo2.text);
    expect(UpadteTodoItemParse2.completed).toBe(false);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedResponse = JSON.parse(groupedTodosResponse.text);
    expect(parsedResponse.allTodos[2].title).toBe("some changes of L9-1-1-1");
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    // FILL IN YOUR CODE HERE
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    const todo = await agent.post("/todos").send({
      title: "Test todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const todoDeleteResponse = await agent
      .delete(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
      });
    const parsedUpdateResponse = JSON.parse(todoDeleteResponse.text);
    expect(parsedUpdateResponse.success).toBe(true);
  });

  // const parsedResponse = JSON.parse(todo.text);
  // const todoID = parsedResponse.id;

  // const deleteResponse = await agent.delete(`/todos/${todoID}`).send();
  // const parsedDeletedResponse = JSON.parse(deleteResponse.text);
  // expect(parsedDeletedResponse).toBe(true);

  //   const deleteNonExistentTodoResponse = await agent
  //     .delete(`/todos/9999`)
  //     .send();
  //   const parsedDeleteNonExistentTodoResponse = JSON.parse(
  //     deleteNonExistentTodoResponse.text
  //   );
  //   expect(parsedDeleteNonExistentTodoResponse).toBe(false);
  // }, 10000);

  test("User A cannot update User B Todos", async () => {
    let res = await agent.get("/signup");
    let csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "IPL",
      lastName: "2023",
      email: "ipl@ipl.com",
      password: "ipl2023",
      _csrf: csrfToken,
    });

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    res = await agent.post("/todos").send({
      title: "Test todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const userA = res.id;

    await agent.get("/signout");

    res = await agent.get("/signup");
    csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "User",
      lastName: "B",
      email: "user.b@test.com",
      password: "userb",
      _csrf: csrfToken,
    });

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const parsedResponse = await agent.put(`/todos/${userA}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    console.log(parsedResponse);
    expect(parsedResponse.statusCode).toBe(422);
  });

  test("User A cannot delete User B Todos", async () => {
    let res = await agent.get("/signup");
    let csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "IPL",
      lastName: "2023",
      email: "ipl@ipl.com",
      password: "ipl2023",
      _csrf: csrfToken,
    });

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    res = await agent.post("/todos").send({
      title: "Test todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const userA = res.id;

    await agent.get("/signout");

    res = await agent.get("/signup");
    csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "User",
      lastName: "B",
      email: "user.b@test.com",
      password: "userb",
      _csrf: csrfToken,
    });

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const parsedResponse = await agent.delete(`/todos/${userA}`).send({
      _csrf: csrfToken,
    });
    expect(parsedResponse.statusCode).toBe(422);
  });
});
