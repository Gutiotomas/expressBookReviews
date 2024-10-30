const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;   // Get the author from request parameters
  let result = [];                    // Array to store books by the given author

  // Iterate over the 'books' object
  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      result.push(books[key]);        // Add the book to the result array if author matches
    }
  });

  if (result.length > 0) {
    res.send(result);                 // Send the list of books by the given author
  } else {
    res.status(404).send({ error: "No books found for the specified author" });  // Handle case where no books are found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;   // Get the author from request parameters
  let result = [];                    // Array to store books by the given author

  // Iterate over the 'books' object
  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      result.push(books[key]);        // Add the book to the result array if author matches
    }
  });

  if (result.length > 0) {
    res.send(result);                 // Send the list of books by the given author
  } else {
    res.status(404).send({ error: "No books found for the specified title" });  // Handle case where no books are found
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
