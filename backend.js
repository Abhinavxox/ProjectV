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
      res.json({ success: true, user: result, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Login failed" });
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
    0
  ).then((result) => {
    console.log(result);
    if (result) {
      res.json({ success: true, message: "Signup successful" });
    } else {
      res.json({ success: false, message: "Signup failed" });
    }
  });
});

app.post("/recharge", (req, res) => {
  const { email, amount } = req.body;
  let amountNumeric = parseInt(amount);
  recharge(email, amountNumeric).then((result) => {
    if (result) {
      res.json({ success: true, message: "Recharge successful" });
    } else {
      res.json({ success: false, message: "Recharge failed" });
    }
  });
});

app.post("/fetchUser", (req, res) => {
  const { email } = req.body;
  fetchUser(email).then((result) => {
    if (result) {
      res.json({ success: true, user: result });
    } else {
      res.json({ success: false });
    }
  });
});

app.get("/fetchAllUsers", (req, res) => {
  fetchAllUsers().then((result) => {
    if (result) {
      res.json({ success: true, users: result });
    } else {
      res.json({ success: false });
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

const recharge = async (email, amount) => {
  try {
    const result = await pool.query(
      `UPDATE users SET amount = ${amount} WHERE email = '${email}'`
    );
    return true;
  } catch (error) {
    return false;
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

const fetchUser = async (email) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    return result.rows[0];
  } catch (error) {
    return error;
  }
};

const fetchAllUsers = async () => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
  } catch (error) {
    return error;
  }
};
