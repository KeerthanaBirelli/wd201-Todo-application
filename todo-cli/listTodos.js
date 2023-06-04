//  listTodos.js
const db = require("./models/index");

const listTodo = async () => {
  try {
    await db.Todo.showList();
  } catch (error) {
    console.error(error);
  }
};
/*const deleteTodo =async (id)=> {
  try {
    const todo = await db.Todo.findByPk(id);
    if (!todo) {
      console.log(`Todo with id ${id} not found`);
      return;
    }
    await todo.destroy();
    console.log(`Todo with id ${id} deleted successfully`);
  } catch (error) {
    console.error(error);
  }
};
deleteTodo(4);*/
(async () => {
  await listTodo();
})();
