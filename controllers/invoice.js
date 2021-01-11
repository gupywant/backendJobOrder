const express = require('express');
const invoice = require('../services/v1/invoice');
const validateToken = require('../Auth/auth.js').validateToken;
let router = express.Router();


router.post('/invoice',validateToken, invoice.create);
router.get('/invoice',validateToken, invoice.read);
router.get('/invoice/:id',validateToken, invoice.readid);
router.delete('/invoice/cancel/:id',validateToken, invoice.cancel);

module.exports = router;