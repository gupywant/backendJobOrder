const express = require('express');
const customerService = require('../services/v1/customer');
const validateToken = require('../Auth/auth.js').validateToken;
let router = express.Router();


router.post('/customer',validateToken,customerService.create);
router.get('/customer/:id', validateToken, customerService.readid);
router.get('/customers', validateToken, customerService.read);
router.put('/customer/:id', validateToken, customerService.update);
router.delete('/customer/:id',validateToken, customerService.remove);

module.exports = router;