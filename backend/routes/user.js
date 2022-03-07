const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require('../models/user');
const app = require("../app");

router.post("/signup", (req, res, next) => {
  // bcrypt function to hash shit. Second param refers to how safe the encryption will be (longer to load tho for higher #s)
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
    });
});

router.post("/login", (req, res, next) => {

  // will be used to store user for use in multiple then and catch blocks
  let fetchedUser;

  // check if the user exists first
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        return res.status(404).json({
          message: 'Auth failed. Couldnt find user'
        });
      }

      fetchedUser = user;
      // cannot un-hash a value, so compare both hashes to see if password is a match with email and valid
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(404).json({
          message: 'Auth failed. Invalid password'
        });
      }

      // create JSON web token here cuz result is valid
      // creates token based on input data of ur choice
      const token = jwt.sign(
        { email: fetchedUser.email, password: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(404).json({
        message: 'Auth failed. (catch block occurred)'
      });
    });
});

module.exports = router;
