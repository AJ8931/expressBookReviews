const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  let userName = req.body.username;
  let password = req.body.password;
  if (userName && password) {
    if (isValid(userName)) {
      users.push({
        "username": userName,
        "password": password
      })
      return res.status(201).json({ message: "User registered successfully!" });

    } else {
      return res.status(400).json({ message: "Invalid username" });
    }
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let ISBN = req.params.isbn;
  let book = books[parseInt(ISBN)];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "No Book By this ISBN" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let filterByAuthor = Object.values(books).filter((book) => (book.author.toLowerCase() === author.toLowerCase()))
  if (filterByAuthor.length > 0) {
    return res.status(200).json(filterByAuthor);
  }
  return res.status(404).json({ message: "No Book By this Author Name" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let filterByTitle = Object.values(books).filter((book) => (book.title.toLowerCase() === title.toLowerCase()))
  if (filterByTitle.length > 0) {
    return res.status(200).json(filterByTitle);
  }
  return res.status(404).json({ message: "No Book By this Title" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let ISBN = req.params.isbn;
  let filterByISBN = books[ISBN];
  if (filterByISBN) {
    return res.status(200).json(filterByISBN.reviews);
  }
  return res.status(404).json({ message: "No Book By this ISBN" });
});

module.exports.general = public_users;
