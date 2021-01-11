const express = require('express');
const vendorService = require('../services/v1/vendor');
const validateToken = require('../Auth/auth.js').validateToken;
let router = express.Router();


router.post('/vendor', validateToken, vendorService.create);
router.get('/vendor/:id', validateToken, vendorService.readid);
router.get('/vendors', validateToken, vendorService.read);
router.put('/vendor/:id', validateToken, vendorService.update);
router.delete('/vendor/:id', validateToken, vendorService.remove);

module.exports = router;