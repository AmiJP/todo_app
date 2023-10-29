import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.get("/", async (req, res) => {
  let result = await db.query("SELECT * FROM items");
  let items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let title = req.body.updatedItemTitle;
  let id = req.body.updatedItemId;
  await db.query("UPDATE items SET title=($1) WHERE id=$2", [title, id]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  let deleteId = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id=$1", [deleteId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
