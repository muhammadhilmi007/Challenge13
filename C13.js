/* 
    ****** Challenge #13 *******

    !! TEBAK TEBAKAN !!
      Buatlah sebuah aplikasi yang dapat mendata daftar pekerjaan kamu.

    !! KEYWORD !!
        1. process.argv
        2. File System
        3. Array
        4. JSON
*/

// !! Driver Code !!
const fs = require("fs");

const fileName = "data.json";

let todos = [];

function loadTodoList() {
  try {
    const data = fs.readFileSync(fileName, "utf-8");
    todos = JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      todo = [];
      saveTodos();
    } else {
      console.error("Error: ", error);
    }
  }
}

function saveTodos() {
  fs.writeFileSync(fileName, JSON.stringify(todos, null, 2));
}

function list() {
  console.log("Daftar Pekerjaan");
  if (todos.length === 0) {
    console.log("Tidak Ada Pekerjaan");
    return;
  }

  todos.forEach((todo, index) => {
    const status = todo.completed ? "[X]" : "[ ]";
    console.log(`${index + 1}. ${status} ${todo.task}`);
  });
}

function add(task) {
  const newTodo = {
    task: task,
    completed: false,
  };
  todos.push(newTodo);
  saveTodos();
  console.log(`"${task}" telah ditambahkan`);
}

function deleteTask(index) {
  if (index < 1 || index > todos.length) {
    console.log("Index tidak Valid.");
    return;
  }

  const deletedTodo = todos.splice(index - 1, 1);
  saveTodos();
  console.log(`"${deletedTodo[0].task}" telah dihapus dari daftar`);
}

function complete(index) {
  if (index < 1 || index > todos.length) {
    console.log("Index tidak Valid.");
    return;
  }

  todos[index - 1].completed = true;
  saveTodos();
  console.log(`"${todos[index - 1].task}" telah selesai.`);
}

function uncomplete(index) {
  if (index < 1 || index > todos.length) {
    console.log("Index tidak Valid.");
    return;
  }

  todos[index - 1].completed = false;
  saveTodos();
  console.log(`"${todos[index - 1].task}" status selesai dibatalkan`);
}

function listOutStanding() {
  const outstandingTasks = todos.filter((todo) => !todo.completed);
  console.log("Daftar Pekerjaan yang belum Selesai:");
  outstandingTasks.forEach((todo, index) => {
    console.log(`${index + 1}. [ ] ${todo.task}`);
  });
}

function listCompleted() {
  const completedTask = todos.filter((todo) => todo.completed);
  console.log("Daftar Pekerjaan yang sudah selesai:");
  completedTask.forEach((todo, index) => {
    console.log(`${index + 1}. [X] ${todo.task}`);
  });
}

function tag(index, ...tags) {
  if (index < 1 || index > todos.length) {
    console.log("Index tidak Valid.");
    return;
  }

  const todo = todos[index - 1];
  todo.task = `${todo.task}`;
  saveTodos();
  //console.log(`Tag ditambahkan ke "${todo.task}"`);
  console.log(`Tag '${tags}' telah ditambahkan ke daftar '${todo.task}'`);
}

function filter(tagName) {
  const filteredTasks = todos.filter((todo) =>
    todo.task.includes(`${tagName}`)
  );
  console.log(`Daftar Pekerjaan `);
  filteredTasks.forEach((todo, index) => {
    const status = todo.completed ? "[X]" : "[ ]";
    console.log(`${index + 1}. ${status} ${todo.task}`);
  });
}

loadTodoList();

const [, , command, ...args] = process.argv;

switch (command) {
  case "list":
    list();
    break;
  case "add":
    if (args.length === 0) {
      console.log("Mohon sertakan task yang akan ditambahkan");
      break;
    }
    add(args.join(" "));
    break;
  case "delete":
    if (args.length === 0) {
      console.log("Mohon sertakan index task yang akan dihapus");
      break;
    }
    deleteTask(parseInt(args[0]));
    break;
  case "complete":
    if (args.length === 0) {
      console.log("Mohon sertakan index task yang akan ditandai selesai.");
      break;
    }
    complete(parseInt(args[0]));
    break;
  case "uncomplete":
    if (args.length === 0) {
      console.log(
        "Mohon sertakan index task yang akan ditandai belum selesai."
      );
      break;
    }
    uncomplete(parseInt(args[0]));
    break;
  case "list:outstanding":
    listOutStanding();
    break;
  case "list:completed":
    listCompleted();
    break;
  case "tag":
    if (args.length < 2) {
      console.log("Mohon sertakan index task dan tag yang akan ditambahkan");
      break;
    }
    const index = parseInt(args[0]);
    const tags = args.slice(1);
    tag(index, ...tags);
    break;
  case "filter":
    if (args.length === 0) {
      console.log("Mohon sertakan tag yang akan difilter.");
      break;
    }
    filter(args[0]);
    break;
  default:
    console.log(">>> JS TODO <<<");
    console.log("<command>");
    console.log("- list");
    console.log("- add <task_content>");
    console.log("- delete <task_id>");
    console.log("- complete <task_id>");
    console.log("- uncomplete <task_id>");
    console.log("- list:outstanding asc|desc");
    console.log("- list:completed asc|desc");
    console.log("- tag <task_id> <tag_name_1> <tag_name_2> ...<tag_name_N");
    console.log("- filter:<tag_name>");
}