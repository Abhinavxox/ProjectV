//create an express server which listens on port 3000
const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  login(email, password).then((result) => {
    if (result) {
      res.json({ message: "Login successful" });
    } else {
      res.json({ message: "Login failed" });
    }
  });
});

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  database: "varshuDB",
  port: "5432",
});

const login = async (email, password) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`
    );
    return result.rows[0];
  } catch (error) {
    return error;
  }
};
