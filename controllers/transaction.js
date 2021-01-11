const express = require('express');
const transaction = require('../services/v1/transaction');
const validateToken = require('../Auth/auth.js').validateToken;
let router = express.Router();


router.post('/transaction',validateToken, transaction.create);
router.post('/transaction/settlement',validateToken, transaction.settlementcreate);
router.post('/transaction/image/:id',validateToken, transaction.uploadImage);
router.get('/transaction/image/:id',validateToken, transaction.readImage);
router.get('/transaction',validateToken, transaction.coderead);
router.get('/transaction/accepted',validateToken, transaction.accepted);
router.get('/transaction/invoice/accepted/:id',validateToken, transaction.invoiceaccepted);
router.get('/transaction/cancel',validateToken, transaction.readcancel);
router.get('/transaction/:id', validateToken, transaction.readid);
router.get('/transaction/approval/:approval', validateToken, transaction.approval);
router.put('/transaction/approving1/:id', validateToken, transaction.approving1);
router.put('/transaction/approving2/:id', validateToken, transaction.approving2);
router.put('/transaction/:id', validateToken, transaction.update);
router.delete('/transaction/:id', validateToken, transaction.remove);
router.delete('/transaction/cancel/:id', validateToken, transaction.cancel);

module.exports = router;