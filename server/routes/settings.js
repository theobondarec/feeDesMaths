const express = require('express')
const router = express.Router()
const FBAuth = require('../middleware/requireLogin')
const admin = require('firebase-admin')

//TODO : reset password + ? modification email ?

module.exports = router