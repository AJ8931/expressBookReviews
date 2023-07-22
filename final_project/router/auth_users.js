const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  let filterUser = users.filter((user) => (
    user.username === username && user.password === password
  ))
  if (filterUser.length > 0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });

  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let ISBN = req.params.isbn;
  let username = req.session.authorization['username'];
  let rating = req.body.rating;
  let comment = req.body.comment;
  if (books[ISBN]) {
    books[ISBN].reviews[username] = { rating: rating, comment: comment };
    return res.status(200).send(username + "comment Added");
  } else {
    return res.status(404).send("Book Not Found");
  }
});

// Delete a book review by username
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let ISBN = req.params.isbn;
  let username = req.session.authorization['username'];
  if (books[ISBN] && books[ISBN].reviews[username]) {
    delete books[ISBN].reviews[username]; // This line deletes the review for the specific username
    return res.status(200).send(username + " review deleted");
  } else {
    return res.status(404).send("Review Not Found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
