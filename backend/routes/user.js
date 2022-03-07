const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require('../models/user');

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

module.exports = router;
