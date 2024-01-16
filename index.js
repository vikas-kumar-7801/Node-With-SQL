const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const { send } = require('process');
const methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended : true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


const connection = mysql.createConnection({
  host: 'localhost',
  user: "root",
  database: 'delta_app',
  password: 'Vikas@7801'
});

let getRandomUser= () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}

//HOME ROUTE
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
   connection.query(q, (err, result) => {
    if(err) throw err;
    let count = result[0]["count(*)"];
    res.render("home.ejs", {count});
   }); 
  } catch (error) {
    console.log(error);
    res.send("Some error in database");
  }
});

// SHOW USERS ROUTE
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, result) => {
     if(err) throw err;
     res.render("showuser.ejs", { result });
    }); 
  } catch (error) {
     console.log(error);
     res.send("Some error in database");
   }
});

// Edit route 
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
     if(err) throw err;
     let user = result[0];
     res.render("edit.ejs", { user });
    }); 
  } catch (error) {
     console.log(error);
     res.send("Some error in database");
   }
});

//Update (DB) ROUTE 
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password:formPass, username:newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  
  try {
    connection.query(q, (err, result) => {
     if(err) throw err;
     let user = result[0];
     if (formPass!= user.password) {
      res.send("Wrong Password!");
     }else {
      let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
      connection.query(q2, (err, result) => {
        if (err) throw err;
        res.redirect("/user");
      });
     }
    }); 
  } catch (error) {
     console.log(error);
     res.send("Some error in database");
   }
});

app.listen(port, () => {
  console.log(`App is listening to ${port}`);
});


// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [];
// for (let i = 1; i <=100; i++) {
// data.push(getRandomUser());  // fake users data 
// }

// connection.query(q,[data],(err, result) => {
//   console.log(result);
// })  

// connection.end();