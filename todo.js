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

function findTodoById(id) {
  return todos.find((todo) => todo.id === parseInt(id));
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
    const tags = todo.tags ? `${todo.tags.join("")}` : "";
    console.log(`${todo.id}. ${status} ${todo.content} ${tags}`);
  });
}

// Mengambil tugas dengan ID spesifik
function getTask(id) {
  const todo = findTodoById(id);
  if (todo) {
    const status = todo.completed ? "[X]" : "[ ]";
    const tags = todo.tags ? ` ${todo.tags.join(" ")}` : "";
    console.log(`Pekerjaan dengan ID: #${todo.id}`);
    console.log(`Title: ${todo.content}`);
    console.log(`Complete: ${status}`);
    console.log(`Tags: ${tags}`);
  } else {
    console.log("Tidak Ada Tugas.");
  }
}

// Fungsi untuk menambah todo list
function add(content) {
  const newID = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  const newTodo = {
    id: newID,
    content: content,
    completed: false,
    tags: [],
    createdAt: new Date().toISOString(),
  };
  todos.push(newTodo);
  saveTodos();
  console.log(`"${content}" telah ditambahkan`);
}

// Fungsi untuk menghapus todo
function deleteTask(id) {
  const index = todos.findIndex((todo) => todo.id === parseInt(id));
  if (index !== -1) {
    const removed = todos.splice(index, 1)[0];
    saveTodos();
    console.log(`"${removed.content}" telah dihapus dari daftar`);
  } else {
    console.log("Tugas tidak ada.");
  }
}

// Fungsi untuk menandai todo sebagai selesai
function complete(id) {
  const todo = findTodoById(id);
  if (todo) {
    todo.completed = true;
    saveTodos();
    console.log(`"${todo.content}" telah selesai.`);
  } else {
    console.log("Tugas tidak ada.");
  }
}

// Fungsi untuk menghapus dari tanda todo yang selesai
function uncomplete(id) {
  const todo = findTodoById(id);
  if (todo) {
    todo.completed = false;
    saveTodos();
    console.log(`"${todo.content}" status selesai dibatalkan`);
  } else {
    console.log("Tugas Tidak Ada.");
  }
}

// Daftar tugas yang belum dikerjakan
function listOutStanding(order = "asc") {
  const outstandingTasks = todos
    .filter((todo) => !todo.completed)
    .sort((a, b) => {
      return order === "asc"
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt);
    });

  if (outstandingTasks.length === 0) {
    console.log("Tidak ada pekerjaan yang belum selesai.");
    return;
  }

  outstandingTasks.forEach((todo) => {
    const tags = todo.tags ? `${todo.tags.join("")}` : "";
    console.log(`${todo.id}. [ ] ${todo.content}${tags}`);
  });
}

// Daftar tugas yang sudah dikerjakan
function listCompleted(order = "asc") {
  const completedTask = todos
    .filter((todo) => todo.completed)
    .sort((a, b) => {
      return order === "asc"
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt);
    });

  if (completedTask.length === 0) {
    console.log("Tidak ada Pekerjaan yang sudah selesai.");
    return;
  }

  completedTask.forEach((todo) => {
    const tags = todo.tags ? `${todo.tags.join("")}` : "";
    console.log(`${todo.id}. [X] ${todo.content}${tags}`);
  });
}

// Menambah Tags pada tugas
function tag(id, ...tags) {
  const todo = findTodoById(id);
  if (todo) {
    todo.tags = todo.tags || [];
    todo.tags.push(...tags);
    todo.tags = [...new Set(todo.tags)];
    saveTodos();
    console.log(
      `Tag '${tags.join(" ")}' telah ditambahkan ke daftar '${todo.content}'`
    );
  } else {
    console.log("Tugas Tidak Ada");
  }
}

// Memfilter tugas berdasarkan Tags
function filter(tagName) {
  const filteredTasks = todos.filter(
    (todo) => todo.tags && todo.tags.includes(tagName)
  );

  if (filteredTasks.length === 0) {
    console.log(`Daftar Pekerjaan `);
    return;
  }
  filteredTasks.forEach((todo) => {
    const status = todo.completed ? "[X]" : "[ ]";
    const tags = `${todo.tags.join("")}`;
    console.log(`${todo.id}. ${status} ${todo.content}`);
  });
}

// Function untuk membuat Baris Perintah
function main() {
  loadTodoList();

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "list":
      list();
      break;
    case "task":
      getTask(args[1]);
      break;
    case "add":
      add(args.slice(1).join(" "));
      break;
    case "delete":
      deleteTask(args[1]);
      break;
    case "complete":
      complete(args[1]);
      break;
    case "uncomplete":
      uncomplete(args[1]);
      break;
    case "list:outstanding":
      listOutStanding(args[1] || "asc");
      break;
    case "list:completed":
      listCompleted(args[1] || "asc");
      break;
    case "tag":
      if (args.length < 3) {
        console.log(
          "Mohon sertakan: tag <task_id> <task_name_1> <task_name_2> "
        );
        break;
      }

      tag(args[1], ...args.slice(2));
      break;
    case "filter:":
      if (args.length < 2) {
        console.log("Mohon sertakan: filter <tag_name>");
        break;
      }
      filter(args[1]);
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
      console.log("node todo.js filter: <tag_name>");
  }
}

// Panggil function (main) untuk memulai Aplikasi
main();

/* 
pekerjaan dengan ID 1 : 
title: saya pergi ke mall
complete: sudah
tags: jalan, senang
*/

/* 
  1. Helper nya diperbaiki
  2. Descending ngk jalan
  3. ID nya miss
  4. Tag ngk ada
  5. Filter By Tag nya ngk ada
*/
