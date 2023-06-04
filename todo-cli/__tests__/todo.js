/*const todoList = require("../todo");
const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suite", () => {
  beforeAll(() => {
    add({
      title: "new todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });
  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });
  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("Should check retrieval of overdue items", () => {
    const od = overdue();
    const a = od.length;
    add({
      title: "Test todo overdue item",
      completed: false,
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .slice(0, 10),
    });
    const od1 = overdue();
    expect(od1.length).toBe(a + 1);
  });
  test("Should check retrieval of due today items", () => {
    const dt = dueToday();
    const b = dt.length;
    add({
      title: "Test todo due today item",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    const dt1 = dueToday();
    expect(dt1.length).toBe(b + 1);
  });
  test("Should check retrieval of due later items", () => {
    const dl = dueLater();
    const c = dl.length;
    add({
      title: "Test todo due later item",
      completed: false,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .slice(0, 10),
    });
    const dl1 = dueLater();
    expect(dl1.length).toBe(c + 1);
  });
});*/
// __tests__/todo.js
/* eslint-disable no-undef */

const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const todoItemsCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
  });
});
