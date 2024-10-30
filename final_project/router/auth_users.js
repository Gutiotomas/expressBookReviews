const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // returns boolean
  // Check if the username already exists in the users array
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  // returns boolean
  // Check if the username and password match any user in the users array
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters
  const review = req.query.review; // Get the review from the request query
  const username = req.session.authorization.username; // Get the username from the session

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // If the book exists, check if reviews already exist for the book
    if (!books[isbn].reviews) {
      books[isbn].reviews = {}; // Initialize reviews object if it doesn't exist
    }

    // Add or modify the review for the current user
    books[isbn].reviews[username] = review;

    return res
      .status(200)
      .json({ message: "Review added/modified successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters
  const username = req.session.authorization.username; // Get the username from the session

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Check if the book has reviews and if a review from the current user exists
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      // Delete the user's review
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      // If the user hasn't posted a review for this book
      return res
        .status(404)
        .json({ message: "Review not found for this user" });
    }
  } else {
    // If the book with the given ISBN doesn't exist
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
