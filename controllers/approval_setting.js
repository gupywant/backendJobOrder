const express = require('express');
const approvalSetting = require('../services/v1/approval_setting');
const validateToken = require('../Auth/auth.js').validateToken;
let router = express.Router();


router.post('/approvalSetting',validateToken,approvalSetting.save);
router.get('/approvalSetting',validateToken,approvalSetting.read);
//router.put('/service/:id', validateToken, service.update);
//router.delete('/service/:id',validateToken, service.remove);

module.exports = router;