const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const todos = []

app.post("/create/:name", (req, res) => {
  const todoItem = {
    "id": todos.length + 1,
    "text": req.params.name
  };
  todos.push(todoItem);
  fs.writeFileSync("REST.json", JSON.stringify(todos));
  res.send(todoItem);

});

app.get("/read", (req, res) => {
  res.send(JSON.stringify(todos));
});

app.listen(port, () => console.log(`File server listening on 3000 port`))
