//configuration settings
const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const cors = require("cors");
app.use(cors());
app.use(express.json());

//routes for api

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  login(email, password).then((result) => {
    console.log(result);
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

app.get("/users", (req, res) => {
  getAllUsers().then((result) => {
    res.json(result);
  });
});

app.post("/signup", (req, res) => {
  const {
    firstName,
    lastName,
    password,
    contactnumber,
    province,
    city,
    streetnumber,
    gender,
    email,
    amount,
  } = req.body;
  // console.log({
  //   firstName: firstName,
  //   lastName: lastName,
  //   password: password,
  //   contactnumber: contactnumber,
  //   province: province,
  //   city: city,
  //   streetnumber: streetnumber,
  //   gender: gender,
  //   email: email,
  //   amount: amount,
  // });
  let amountNumeric = parseInt(amount);
  signup(
    firstName,
    lastName,
    password,
    contactnumber,
    province,
    city,
    streetnumber,
    gender,
    email,
    amountNumeric
  ).then((result) => {
    console.log(result);
    if (result) {
      res.json({ message: "Signup successful" });
    } else {
      res.json({ message: "Signup failed" });
    }
  });
});

//pg config

const { Pool } = require("pg");
const pool = new Pool({
  user: "projectvdb_user",
  password: "g6z6eSz0s11iFvuo6smTloG4CjDdl62H",
  host: "dpg-cpfuqqf79t8c73eaalag-a.singapore-postgres.render.com",
  database: "projectvdb",
  port: "5432",
  ssl: {
    rejectUnauthorized: false,
  },
});

//functions

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

const getAllUsers = async () => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
  } catch (error) {
    return error;
  }
};

const signup = async (
  firstName,
  lastName,
  password,
  contactnumber,
  province,
  city,
  streetnumber,
  gender,
  email,
  amount
) => {
  try {
    console.log({
      firstName: firstName,
      lastName: lastName,
      password: password,
      contactnumber: contactnumber,
      province: province,
      city: city,
      streetnumber: streetnumber,
      gender: gender,
      email: email,
      amount: amount,
    });
    await pool.query(
      `INSERT into users (firstName, lastName, password, contactnumber, province, city, streetnumber, gender, email, amount ) values ('${firstName}', '${lastName}', '${password}', '${contactnumber}', '${province}', '${city}', '${streetnumber}', '${gender}', '${email}', '${amount}')`
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
