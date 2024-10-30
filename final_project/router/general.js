const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}
// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/books', (req, res) => {
  res.json(books); // Return the list of books as JSON
});
public_users.get('/', async (req, res) => {
  try {
    // Make an API call to fetch books
    const response = await axios.get('http://localhost:5000/books');
    res.json(response.data); // Send the fetched book data as response
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books." });
  }
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //Write your code here
 // res.send(JSON.stringify(books,null,3));
//});

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
  const isbn = req.params.isbn;
  const book = books[isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
