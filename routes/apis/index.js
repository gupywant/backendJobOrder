const express = require('express');
const v1ApiController = require('./v1');
const Auth = require('../../services/v1/auth')
let router = express.Router();

router.use('/api', v1ApiController);
router.post('/login',Auth.authenticateLogin);
module.exports = router;