const express = require('express');
const service = require('../services/v1/service');
const validateToken = require('../Auth/auth.js').validateToken;
let router = express.Router();


router.post('/service',validateToken,service.create);
router.get('/service', validateToken, service.read);
router.put('/service/:id', validateToken, service.update);
router.delete('/service/:id',validateToken, service.remove);

module.exports = router;