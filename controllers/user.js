const express = require('express');
const userService = require('../services/v1/user');
const validateToken = require('../Auth/auth.js').validateToken;
let router = express.Router();

router.get('/users',validateToken,userService.getAllUserList);
router.post('/users/add',userService.createUser);
router.get('/user',validateToken,userService.getUserById);
router.post('/user/update',validateToken,userService.updateUser);
router.delete('/user/:id',validateToken,userService.deleteUser);


router.get('/test',userService.getUserById);

module.exports = router;