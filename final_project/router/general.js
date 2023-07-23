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

function getAllBooks() {
  return new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (error) {
      reject(error);
    }
  });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getAllBooks()
    .then((Book) => {
      return res.status(200).send(JSON.stringify(Book));
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send("Error occurred");
    });
});


// BooksByISBN function with Promise callbacks
function BooksByISBN(ISBN) {
  return new Promise((resolve, reject) => {
    try {
      const book = books[parseInt(ISBN)];
      if (book) {
        resolve(book)
      } else {
        reject(new Error("No Book By this ISBN"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  let ISBN = req.params.isbn;
  BooksByISBN(ISBN)
    .then((Book) => {
      return res.status(200).json(Book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});


// Function to get books by author using Promise callbacks
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    try {
      const filterByAuthor = Object.values(books).filter((book) =>
        (book.author.toLowerCase() === author.toLowerCase()));

      if (filterByAuthor.length > 0) {
        resolve(filterByAuthor);
      } else {
        reject(new Error("No Book By this Author Name"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  getBooksByAuthor(author)
    .then((books) => {
      return res.status(200).json(books);
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

// Function to get books by title using Promise callbacks
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    try {
      const filterByTitle = Object.values(books).filter((book) =>
        (book.title.toLowerCase() === title.toLowerCase()));

      if (filterByTitle.length > 0) {
        resolve(filterByTitle);
      } else {
        reject(new Error("No Book By this Title"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  getBooksByTitle(title)
    .then((books) => {
      return res.status(200).json(books);
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
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
