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

// File Untuk Menyimpan todo list
const fileName = "data.json";
// Inisialiasi Array Todos
let todos = [];

// Fungsi untuk membaca todos dari file
function loadTodoList() {
  try {
    const data = fs.readFileSync(fileName, "utf-8");
    todos = JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Jika file tidak ada, buat array kosong
      todo = [];
      saveTodos(); // Buat file baru
    } else {
      console.error("Error: ", error);
    }
  }
}

// Fungsi untuk menyimpan todos ke file
function saveTodos() {
  fs.writeFileSync(fileName, JSON.stringify(todos, null, 2));
}

// Fungsi untuk menampilkan daftar todo list
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

// Fungsi untuk menambah todo list
function add(task) {
  const newTodo = {
    task: task,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(newTodo);
  saveTodos();
  console.log(`"${task}" telah ditambahkan`);
}

// Fungsi untuk menghapus todo
function deleteTask(index) {
  if (index < 1 || index > todos.length) {
    console.log("Index tidak Valid.");
    return;
  }

  const deletedTodo = todos.splice(index - 1, 1);
  saveTodos();
  console.log(`"${deletedTodo[0].task}" telah dihapus dari daftar`);
}

// Fungsi untuk menandai todo sebagai selesai
function complete(index) {
  if (index < 1 || index > todos.length) {
    console.log("Index tidak Valid.");
    return;
  }

  todos[index - 1].completed = true;
  todos[index - 1].completedAt = new Date().toISOString();
  saveTodos();
  console.log(`"${todos[index - 1].task}" telah selesai.`);
}

function uncomplete(index) {
  if (index < 1 || index > todos.length) {
    console.log("Index tidak Valid.");
    return;
  }

  todos[index - 1].completed = false;
  delete todos[index - 1].completedAt; // Tambah timeStamp
  saveTodos();
  console.log(`"${todos[index - 1].task}" status selesai dibatalkan`);
}

function sortTodos(tasks, order = "asc") {
  return tasks
    .map((task, index) => ({ ...task, indexAsli: index + 1 }))
    .sort((a, b) => {
      const taskA = a.task.toLowerCase();
      const taskB = b.task.toLowerCase();
      if (order === "asc") {
        return taskA.localeCompare(taskB);
      }
      return taskB.localeCompare(taskA);
    });
}

function listOutStanding(order = "asc") {
  const outstandingTasks = todos.filter((todo) => !todo.completed);

  if (outstandingTasks.length === 0) {
    console.log("Tidak ada pekerjaan yang belum selesai.");
    return;
  }

  if (order === "desc") {
    console.log("Daftar Pekerjaan yang belum selesai.");
    [...outstandingTasks].reverse().forEach((todo, index) => {
      const taskNumber = outstandingTasks.length - index;
      console.log(`${taskNumber}. [ ] ${todo.task}`);
      // if (todo.tags && todo.tags.length > 0) {
      //   console.log(`Tags: ${todo.tags.join(",")}`);
      // }
    });
  } else {
    console.log("Daftar Pekerjaan yang belum selesai.");
    outstandingTasks.forEach((todo, index) => {
      console.log(`${index + 1}. [ ] ${todo.task}`);
      // if (todo.tags && todo.tags.length > 0) {
      //   console.log(`Tags: ${todo.tags.join(", ")}`);
      // }
    });
  }
}

function listCompleted(order = "asc") {
  const completedTask = todos.filter((todo) => todo.completed);

  if (completedTask.length === 0) {
    console.log("Tidak ada Pekerjaan yang sudah selesai.");
    return;
  }

  if (order == "desc") {
    console.log("Daftar Pekerjaan yagn sudah selesai.");
    [...completedTask].reverse().forEach((todo, index) => {
      const taskNumber = completedTask.length - index;
      console.log(`${taskNumber}. [X] ${todo.task}`);
      // if (todo.tags && todo.tags.length > 0) {
      //   console.log(`Tags: ${todo.tags.join(",")}`);
      // }
    });
  } else {
    console.log("Daftar Pekerjaan yang sudah selesai.");
    completedTask.forEach((todo, index) => {
      console.log(`${index + 1}. [X] ${todo.task}`);
      // if (todo.tags && todo.tags.length > 0) {
      //   console.log(`Tags: ${todo.tags.join(", ")}`);
      // }
    });
  }
}

function tag(index, ...tags) {
  if (index < 1 || index > todos.length) {
    console.log("Index tidak Valid.");
    return;
  }

  const todo = todos[index - 1];
  // Inisialisasi Array tags jika belum ada
  if (!todo.tags) {
    todo.tags = [];
  }

  // Tambahkan tags baru ke Array tags yang ada
  tags.forEach((tag) => {
    if (!todo.tags.includes(tag)) {
      todo.tags.push(tag);
    }
  });
  // todo.task = `${todo.task} ${tags.join(" ,")}`;
  saveTodos();
  //console.log(`Tag ditambahkan ke "${todo.task}"`);
  console.log(
    `Tag '${tags.join("")}' telah ditambahkan ke daftar '${todo.task}'`
  );
}

function filter(tagName) {
  const filteredTasks = todos.filter(
    (todo) => todo.tags && todo.tags.includes(tagName)
  );
  console.log(`Daftar Pekerjaan `);
  if (filteredTasks.length === 0) {
    return;
  }
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
    listOutStanding(args[0] || "asc");
    break;
  case "list:completed":
    listCompleted(args[0] || "asc");
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
    console.log("node todo.js <command>");
    console.log("node todo.js list");
    console.log("node todo.js task <task_id>");
    console.log("node todo.js add <task_content>");
    console.log("node todo.js delete <task_id>");
    console.log("node todo.js complete <task_id>");
    console.log("node todo.js uncomplete <task_id>");
    console.log("node todo.js list:outstanding asc|desc");
    console.log("node todo.js list:completed asc|desc");
    console.log(
      "node todo.js tag <task_id> <tag_name_1> <tag_name_2> ...<tag_name_N"
    );
    console.log("node todo.js filter:<tag_name>");
}

/* 
  1. Helper nya diperbaiki
  2. Descending ngk jalan
  3. ID nya miss
  4. Tag ngk ada
  5. Filter By Tag nya ngk ada
*/
