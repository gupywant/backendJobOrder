const userController = require('../../controllers/user')
const customerController = require('../../controllers/customer')
const vendorController = require('../../controllers/vendor')
const serviceController = require('../../controllers/service')
const customerServiceController = require('../../controllers/customer_service')
const transactionController = require('../../controllers/transaction')
const approvalController = require('../../controllers/approval_setting')
const invoiceController = require('../../controllers/invoice')
const express = require('express');
let router = express.Router();
router.use('/v1', userController);
router.use('/v1', customerController);
router.use('/v1', vendorController);
router.use('/v1', serviceController);
router.use('/v1', customerServiceController);
router.use('/v1', transactionController);
router.use('/v1', approvalController);
router.use('/v1', invoiceController);
module.exports = router;