const express = require('express');
const customerService = require('../services/v1/customer_service');
const validateToken = require('../Auth/auth.js').validateToken;
let router = express.Router();


router.post('/customerService',validateToken,customerService.create);
router.get('/customerService/:id', validateToken, customerService.readid);
router.get('/customerServiceAvail/:id', validateToken, customerService.readidavail);
router.delete('/customerDeleteAll/:id',validateToken, customerService.deleteAll);
router.post('/customerService/:id',validateToken, customerService.remove);
//router.put('/service/:id', validateToken, service.update);
//router.delete('/service/:id',validateToken, service.remove);

module.exports = router;