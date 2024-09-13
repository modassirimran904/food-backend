const express = require('express')
const { body, validationResult } = require('express-validator')

const router = express.Router()
const User = require('../models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwtSecrete = 'Mynameismodassirimrangraduateengineer2024'
router.post(
  '/createuser',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('name')
      .isLength({ min: 5 })
      .withMessage('Name must be at least 5 characters long'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const salt = await bcrypt.genSalt(10)
    const secPassword = await bcrypt.hash(req.body.password, salt)

    try {
      const newUser = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location
      })

      return res.status(201).json({ success: true, user: newUser })
    } catch (error) {
      console.error('Error creating user:', error.message || error)
      return res.status(500).json({ success: false, error: 'Server Error' })
    }
  }
)

router.post(
  '/loginuser',
  [body('email').isEmail().withMessage('Please enter a valid email address')],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    let email = req.body.email

    try {
      let userData = await User.findOne({ email })

      if (!userData) {
        return res.status(400).json({ errors: 'Enter correct email Id' })
      }
      const pwdCompare = await bcrypt.compare(
        req.body.password,
        userData.password
      )

      if (!pwdCompare) {
        return res.status(400).json({ errors: 'Password is not correct' })
      }

      const data = {
        user: {
          id: userData.id
        }
      }
      const authToken = jwt.sign(data, jwtSecrete)
      return res.json({
        success: true,
        authToken: authToken
      })
    } catch (error) {
      console.error('Error creating user:', error.message || error)
      return res.status(500).json({ success: false, error: 'Server Error' })
    }
  }
)

module.exports = router
