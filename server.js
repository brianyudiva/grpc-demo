const grpc = require("grpc");
const fs = require('fs');
const Schema = require("./todo_pb");
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("localhost:5000",
 grpc.ServerCredentials.createInsecure());

server.addService(todoPackage.Todo.service,
    {
        "createTodo": createTodo,
        "readTodosStream": readTodosStream
    });
server.start();

const todos = [];
const todosPB = new Schema.TodoItems();

function createTodo (call, callback) {
    const todoItem = new Schema.TodoItem()
    todoItem.setId(todos.length + 1);
    todoItem.setText(call.request.text);
    todosPB.addItems(todoItem);

    const todoItemJSON = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItemJSON );

    
    const bytes = todosPB.serializeBinary();
    fs.writeFileSync("todoBinary", bytes);
    
    callback(null, todoItemJSON);
}

function readTodosStream(call, callback) {
    
    todos.forEach(t => call.write(t));
    call.end();
}