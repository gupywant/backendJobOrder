const express = require('express');
const mongoose = require('mongoose');
const TransactionCode = require('../../models/transaction_code');
const TransactionSettlement = require('../../models/transaction_settlement');
const Transaction = require('../../models/transaction');
const CustomerService = require('../../models/customer_service');
const ImageDoc = require('../../models/image_doc');

const coderead = async (req,res,next) => {
	try{
		let transactionCode = await TransactionCode.aggregate([
			{ 	"$match" : {
        			cancel: false,
        		} 
        	},
        	{ 
        		$lookup: 
	        		{
	        			from: 'customers',
	        			localField: 'id_customer',
	        			foreignField: '_id',
	        			as: 'customer_detail'
	        		}
        	},
        	{   $unwind:"$customer_detail" },
        	{
        		$project:
        			{
			            id_transaction : 1,
			            code: 1,
			            id_customer: 1,
			            customer_email : "$customer_detail.email",
			            customer_name : "$customer_detail.name",
			            createdAt: 1,
			            updatedAt: 1
		        	} 
        	}
		])
		if (transactionCode.length > 0) {
            return res.status(200).json({
                'message': 'Transaction list fetched successfully',
                'data': transactionCode
            });
        }else{
        	return res.status(404).json({
            	'code': 'BAD_REQUEST_ERROR',
            	'description': 'No transactions found in the system'
            });
        }
	}catch (error) {
    	console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const read = async (req,res,next) => {
	try{
        let transaction = await Transaction.aggregate([
        	{ 
        		$lookup: 
	        		{
	        			from: 'services',
	        			localField: 'id_service',
	        			foreignField: '_id',
	        			as: 'service_detail'
	        		}
        	},
        	{   $unwind:"$service_detail" },
        	{ 
        		$lookup:
        			{
	        			from: 'customers',
	        			localField: 'id_customer',
	        			foreignField: '_id',
	        			as: 'customer_detail'
	        		}
        	},
        	{   $unwind:"$customer_detail" },
        	{ 
        		$lookup:
        			{
	        			from: 'vendors',
	        			localField: 'id_vendor',
	        			foreignField: '_id',
	        			as: 'vendor_detail'
	        		}
        	},
        	{   $unwind:"$vendor_detail" },

        	{   
		        $project:{
		            id_transaction : 1,
		            planned_amount: 1,
		            customer_email : "$customer_detail.email",
		            customer_name : "$customer_detail.name",
		            vendor_name : "$vendor_detail.name",
		            service_name : "$service_detail.name",
		            createdAt: 1,
		            updatedAt: 1
		        } 
		    }
        ])
        if (transaction.length > 0) {
            return res.status(200).json({
                'message': 'Transaction fetched successfully',
                'data': transaction
            });
        }
        console.log(transaction)
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No transaction found in the system'
        });
    }catch (error) {
    	console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const create = async (req,res,next) => {
	try{
		const {
			id_customer,
			id_service,
			id_vendor,
			planned_amount,
            qty
        } = req.body;

        let code = 0
        let tCode = await TransactionCode.find({})
        if(!tCode.length){
            code = 1
        }else{
            const no = await TransactionCode.find({}).sort({"code" : -1})
            console.log(no[0].code)
            code = no[0].code + 1
        }
        const c = {
            code: code,
            id_customer: id_customer,
            id_vendor: id_vendor,
            cancel: false,
            approval1: false,
            approval2: false,
            settlement: false,
            total_amount: 0
        }
        transactioncodes = await TransactionCode.create(c);
        let total_amount = 0;
        for(let i = 0; i <= id_service.length-1; i++){
            const temp = {
                id_code: transactioncodes._id,
                id_customer: id_customer,
                id_service: id_service[i].id_service,
                id_vendor: id_vendor,
                qty: qty[i],
                planned_amount: planned_amount[i]
            }
            let newTransaction = await Transaction.create(temp);
            total_amount += (parseInt(planned_amount[i]) * parseInt(qty[i]))
        }
        const update = {
            total_amount: total_amount
        }
        let updateTransactioncode = await TransactionCode.findOneAndUpdate({_id: mongoose.Types.ObjectId(transactioncodes._id)}, update, {
                new: true,
                useFindAndModify: false
            });
        if(transactioncodes){
            return res.status(201).json({
                'message': 'Transaction created successfully',
                'code': transactioncodes.code
            });
        }
	}catch(error){
		console.log(error)
		return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
	}
}
const readid = async (req,res,next) => {
	try{
        let transaction = await Transaction.aggregate([
        	{ 	"$match" : {
        			id_code: mongoose.Types.ObjectId(req.params.id),
        		} 
        	},
        	{ 
        		$lookup: 
	        		{
	        			from: 'services',
	        			localField: 'id_service',
	        			foreignField: '_id',
	        			as: 'service_detail'
	        		}
        	},
        	{   $unwind:"$service_detail" },
        	{ 
        		$lookup:
        			{
	        			from: 'vendors',
	        			localField: 'id_vendor',
	        			foreignField: '_id',
	        			as: 'vendor_detail'
	        		}
        	},
        	{   $unwind:"$vendor_detail" },
        	{ 
        		$lookup:
        			{
	        			from: 'transactioncodes',
	        			localField: 'id_code',
	        			foreignField: '_id',
	        			as: 'code_detail'
	        		}
        	},
        	{   $unwind:"$code_detail" },
            { 
                $lookup:
                    {
                        from: 'customers',
                        localField: 'code_detail.id_customer',
                        foreignField: '_id',
                        as: 'customer_detail'
                    }
            },
            {   $unwind:"$customer_detail" },
        	{   
		        $project:{	
		            id_transaction : 1,
                    qty: 1,
                    total_amount: "$code_detail.total_amount",
		            planned_amount: 1,
		            customer_id : "$customer_detail._id",
		            customer_email : "$customer_detail.email",
		            customer_name : "$customer_detail.name",
		            vendor_id : "$vendor_detail._id",
		            vendor_name : "$vendor_detail.name",
		            service_id : "$service_detail._id",
		            service_name : "$service_detail.name",
		            service_description : "$service_detail.description",
		            customer_code: "$customer_detail.code",
		            vendor_code: "$vendor_detail.code",
		            service_code: "$service_detail.code",
		            code : "$code_detail.code",
		            createdAt: 1,
		            updatedAt: 1
		        } 
		    }
        ])
        if (transaction.length > 0) {
            return res.status(200).json({
                'message': 'Transaction fetched successfully',
                'data': transaction
            });
        }
        console.log(transaction)
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No transaction found in the system'
        });
    }catch (error) {
    	console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const update = async (req,res,next) => {
	try{
		const {
            _id,
			id_customer,
			id_service,
			id_vendor
        } = req.body;
        let isExists = await Transaction.find({id_code: mongoose.Types.ObjectId(_id)});
        console.log(_id)
        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No transaction found in the system'
            });
        }
        let total_amounts = 0
        await id_service.map(async (item, index) => {
            console.log(item.planned_amount)
	        const temp = await {
				id_vendor: id_vendor,
                qty: parseInt(item.qty),
				planned_amount: parseInt(item.planned_amount)
	        }

	        await Transaction.findOneAndUpdate({id_code: mongoose.Types.ObjectId(_id), id_service: item.id_service}, temp, {
	            new: true,
	            useFindAndModify: false
	        });
            total_amounts =  total_amounts + (parseInt(item.planned_amount) * parseInt(item.qty))
            console.log(await TransactionCode.findOneAndUpdate(
                    {
                        _id: mongoose.Types.ObjectId(_id)
                    },
                    {
                        id_vendor: id_vendor,
                        total_amount: total_amounts,
                        approval1: false,
                        approval2: false,
                        settlement: false
                    },
                    {
                        new: true,
                        useFindAndModify: false
                    }
                ))
	     })
        return res.status(201).json({
            'message': 'Transaction updated successfully',
            'data': 1
        })
	}catch(error){
		console.log(error)
		return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
	}
}

const remove = async (req,res,next) => {
    try{
        let id = req.params.id;

        let isExists = await Transaction.find({id_code: mongoose.Types.ObjectId(id)});
        if (!isExists.length) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No transaction found in the system'
            });
        }
        //note to update
        const transaction = await TransactionCode.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(id)
                },
                {
                    approval1: false
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            )
        console.log(transaction.approval1 === false)
        //await TransactionCode.remove({_id: mongoose.Types.ObjectId(id)})
        //let transaction = await Transaction.deleteMany({id_code: mongoose.Types.ObjectId(id)});
        if (transaction.approval1 === false) {
            return res.status(200).json({
                'message': `Job order with id ${id} rejected successfully`
            });
        }
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const approval = async (req,res,next) => {
	try{
        let approval1 = await req.params.approval == 1 ? false : true
        let approval2 = await req.params.approval == 3 ? true : false
        console.log(approval2)
		let transactionCode = await TransactionCode.aggregate([
			{ 	"$match" : {
        			cancel: false,
        			approval1: approval1,
        			approval2: approval2,
                    settlement: false
        		}
        	},
        	{ 
        		$lookup: 
	        		{
	        			from: 'customers',
	        			localField: 'id_customer',
	        			foreignField: '_id',
	        			as: 'customer_detail'
	        		}
        	},
        	{   $unwind:"$customer_detail" },
        	{ 
        		$lookup: 
	        		{
	        			from: 'vendors',
	        			localField: 'id_vendor',
	        			foreignField: '_id',
	        			as: 'vendor_detail'
	        		}
        	},
        	{   $unwind:"$vendor_detail" },
        	{
        		$project:
        			{
        				total_amount: 1,
			            id_transaction : 1,
			            code: 1,
                        approval1_date: 1,
                        approval2_date: 1,
                        settlement_date: 1,
			            id_customer: 1,
                        vendor_code : "$vendor_detail.code",
			            customer_code : "$customer_detail.code",
			            createdAt: 1,
			            updatedAt: 1
		        	} 
        	}
		])
		if (transactionCode.length > 0) {
            return res.status(200).json({
                'message': 'Transaction approval fetched successfully',
                'data': transactionCode
            });
        }else{
        	return res.status(404).json({
            	'code': 'BAD_REQUEST_ERROR',
            	'description': 'No transactions found in the system'
            });
        }
	}catch (error) {
    	console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const approving1 = async (req,res,next) => {
	try{
		let id = req.params.id;

        let isExists = await TransactionCode.find({_id: mongoose.Types.ObjectId(id)});
        if (!isExists.length) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No transaction found in the system'
            });
        }
        const date = new Date()
        await TransactionCode.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(id)
                },
                {
                    approval1: true,
                    approval1_date: date
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            )
        return res.status(200).json({
            'message': `Vendor with id ${id} deleted successfully`
        });
	}catch (error) {
    	console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const approving2 = async (req,res,next) => {
	try{
		let id = req.params.id;

        let isExists = await TransactionCode.find({_id: mongoose.Types.ObjectId(id)});
        if (!isExists.length) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No transaction found in the system'
            });
        }
        const date = new Date()
        await TransactionCode.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(id)
                },
                {
                    approval2: true,
                    approval2_date: date
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            )
        return res.status(200).json({
            'message': `Vendor with id ${id} deleted successfully`
        });
	}catch (error) {
    	console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const readcancel = async (req,res,next) => {
    try{
        let transactionCode = await TransactionCode.aggregate([
            {   "$match" : {
                    cancel: false
                }
            },
            { 
                $lookup: 
                    {
                        from: 'customers',
                        localField: 'id_customer',
                        foreignField: '_id',
                        as: 'customer_detail'
                    }
            },
            {   $unwind:"$customer_detail" },
            { 
                $lookup: 
                    {
                        from: 'vendors',
                        localField: 'id_vendor',
                        foreignField: '_id',
                        as: 'vendor_detail'
                    }
            },
            {   $unwind:"$vendor_detail" },
            {
                $project:
                    {
                        total_amount: 1,
                        id_transaction : 1,
                        code: 1,
                        id_customer: 1,
                        customer_code : "$customer_detail.code",
                        vendor_code : "$vendor_detail.code",
                        createdAt: 1,
                        updatedAt: 1
                    } 
            }
        ])
        if (transactionCode.length > 0) {
            return res.status(200).json({
                'message': 'Transaction approval fetched successfully',
                'data': transactionCode
            });
        }else{
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No transactions found in the system'
            });
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const cancel = async (req,res,next) => {
    try{
        let id = req.params.id;

        let isExists = await TransactionCode.find({_id: mongoose.Types.ObjectId(id)});
        if (!isExists.length) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No job order found in the system'
            });
        }
        const update = await TransactionCode.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(id)
                },
                {
                    cancel: true
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            )
        return res.status(200).json({
            'message': `Job order with id ${id} canceled successfully`
        });
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const settlementcreate = async (req,res,next) => {
    try{
        const {
            _id,
            id_customer,
            id_service,
            id_vendor
        } = req.body;
        let isExists = await Transaction.find({id_code: mongoose.Types.ObjectId(_id)});
        console.log(_id)
        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No transaction found in the system'
            });
        }
        console.log(id_service)
        let total_amounts = 0
        await id_service.map(async (item, index) => {
            const temp = await {
                id_code: _id,
                id_service: item.id_service,
                id_vendor: id_vendor,
                qty: parseInt(item.qty),
                planned_amount: parseInt(item.settlement_amount)
            }

            await TransactionSettlement.create(temp);
            total_amounts =  total_amounts + (parseInt(item.settlement_amount) * parseInt(item.qty))
            console.log(await TransactionCode.findOneAndUpdate(
                    {
                        _id: mongoose.Types.ObjectId(_id)
                    },
                    {
                        settlement: true,
                        settlement_date: new Date(),
                        id_vendor: id_vendor,
                        settlement_amount: total_amounts,
                    },
                    {
                        new: true,
                        useFindAndModify: false
                    }
                ))
         })
        return res.status(201).json({
            'message': 'Transaction updated successfully',
            'data': 1
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const readSettled = async (req,res,next) => {
    try{
        //const settlement = await TransactionSettlement.find(/*{id_code : mongoose.Types.ObjectId(req.params.id)}*/)
        const settlement = await TransactionCode.aggregate([
            {   "$match" : {
                    cancel: false,
                    settlement: true
                }
            },
            { 
                $lookup: 
                    {
                        from: 'customers',
                        localField: 'id_customer',
                        foreignField: '_id',
                        as: 'customer_detail'
                    }
            },
            {   $unwind:"$customer_detail" },
            { 
                $lookup: 
                    {
                        from: 'vendors',
                        localField: 'id_vendor',
                        foreignField: '_id',
                        as: 'vendor_detail'
                    }
            },
            {   $unwind:"$vendor_detail" },
            {
                $project:
                    {
                        total_amount: 1,
                        settlement_amount: 1,
                        id_transaction : 1,
                        code: 1,
                        id_customer: 1,
                        customer_code : "$customer_detail.code",
                        vendor_code : "$vendor_detail.code",
                        approval1_date: 1,
                        approval2_date: 1,
                        settlement_date: 1,
                        createdAt: 1,
                        updatedAt: 1
                    } 
            }
        ])
        if(settlement.length > 0){
            return res.status(200).json({
                'message': 'Settled Job Order fetched successfully',
                'data': settlement
            });
        }else{
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No Settled Job Order found in the system'
            });
        }
    }catch (error) {
            console.log(error)
            return res.status(500).json({
                'code': 'SERVER_ERROR',
                'description': 'something went wrong, Please try again'
            });
        }
}
const readsettledid = async (req,res,next) => {
    try{
        let transaction = await TransactionSettlement.aggregate([
            {   "$match" : {
                    id_code: mongoose.Types.ObjectId(req.params.id),
                } 
            },
            { 
                $lookup: 
                    {
                        from: 'services',
                        localField: 'id_service',
                        foreignField: '_id',
                        as: 'service_detail'
                    }
            },
            {   $unwind:"$service_detail" },
            { 
                $lookup:
                    {
                        from: 'vendors',
                        localField: 'id_vendor',
                        foreignField: '_id',
                        as: 'vendor_detail'
                    }
            },
            {   $unwind:"$vendor_detail" },
            { 
                $lookup:
                    {
                        from: 'transactioncodes',
                        localField: 'id_code',
                        foreignField: '_id',
                        as: 'code_detail'
                    }
            },
            {   $unwind:"$code_detail" },
            { 
                $lookup:
                    {
                        from: 'customers',
                        localField: 'code_detail.id_customer',
                        foreignField: '_id',
                        as: 'customer_detail'
                    }
            },
            {   $unwind:"$customer_detail" },
            {   
                $project:{  
                    id_transaction : 1,
                    qty: 1,
                    total_amount: "$code_detail.total_amount",
                    planned_amount: 1,
                    customer_id : "$customer_detail._id",
                    customer_email : "$customer_detail.email",
                    customer_name : "$customer_detail.name",
                    vendor_id : "$vendor_detail._id",
                    vendor_name : "$vendor_detail.name",
                    service_id : "$service_detail._id",
                    service_name : "$service_detail.name",
                    service_description : "$service_detail.description",
                    customer_code: "$customer_detail.code",
                    vendor_code: "$vendor_detail.code",
                    service_code: "$service_detail.code",
                    code : "$code_detail.code",
                    createdAt: 1,
                    updatedAt: 1
                } 
            }
        ])
        if (transaction.length > 0) {
            return res.status(200).json({
                'message': 'Transaction fetched successfully',
                'data': transaction
            });
        }
        console.log(transaction)
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No transaction found in the system'
        });
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const accepted = async (req,res,next) => {
    try{
        let transactionCode = await TransactionCode.aggregate([
            {   "$match" : {
                    cancel: false,
                    settlement: true
                }
            },
            { 
                $lookup: 
                    {
                        from: 'customers',
                        localField: 'id_customer',
                        foreignField: '_id',
                        as: 'customer_detail'
                    }
            },
            {   $unwind:"$customer_detail" },
            { 
                $lookup: 
                    {
                        from: 'vendors',
                        localField: 'id_vendor',
                        foreignField: '_id',
                        as: 'vendor_detail'
                    }
            },
            {   $unwind:"$vendor_detail" },
            {
                $project:
                    {
                        total_amount: 1,
                        settlement_amount: 1,
                        id_transaction : 1,
                        code: 1,
                        id_customer: 1,
                        customer_code : "$customer_detail.code",
                        vendor_code : "$vendor_detail.code",
                        createdAt: 1,
                        updatedAt: 1
                    } 
            }
        ])
        if (transactionCode.length > 0) {
            return res.status(200).json({
                'message': 'Transaction approval fetched successfully',
                'data': transactionCode
            });
        }else{
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No transactions found in the system'
            });
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const invoiceaccepted = async (req,res,next) => {
    try{
        let transactionCode = await TransactionCode.aggregate([
            {   "$match" : {
                    id_customer: mongoose.Types.ObjectId(req.params.id),
                    cancel: false,
                    settlement: true
                }
            },
            { 
                $lookup: 
                    {
                        from: 'customers',
                        localField: 'id_customer',
                        foreignField: '_id',
                        as: 'customer_detail'
                    }
            },
            {   $unwind:"$customer_detail" },
            { 
                $lookup: 
                    {
                        from: 'vendors',
                        localField: 'id_vendor',
                        foreignField: '_id',
                        as: 'vendor_detail'
                    }
            },
            {   $unwind:"$vendor_detail" },
            {
                $project:
                    {
                        total_amount: 1,
                        settlement_amount: 1,
                        id_transaction : 1,
                        code: 1,
                        id_customer: 1,
                        qty: 1,
                        customer_code : "$customer_detail.code",
                        vendor_code : "$vendor_detail.code",
                        createdAt: 1,
                        updatedAt: 1
                    } 
            }
        ])
        if (transactionCode.length > 0) {
            return res.status(200).json({
                'message': 'Job order fetched successfully',
                'data': transactionCode
            });
        }else{
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No job order(settlement) for this customer found in the system'
            });
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const uploadImage = async (req,res,next) => {
    try{

        const image = req.body.image

        const temp = {
            id_code: req.params.id,
            doc1: image[0][0],
            doc2: image[0][1],
            pli1: image[1][0],
            pli2: image[1][1],
            csm1: image[2][0],
            csm2: image[2][1],
            csm3: image[3][0],
            csm4: image[3][1],
            rel1: image[4][0],
            rel2: image[4][1],
            stf1: image[5][0],
            stf2: image[5][1],
            yel1: image[6][0],
            yel2: image[6][1]
        }
        const imageFind = await ImageDoc.find({id_code : mongoose.Types.ObjectId(req.params.id)})
        if(imageFind.length > 0){
            const imageDoc = await ImageDoc.findOneAndUpdate({id_code: mongoose.Types.ObjectId(req.params.id)}, temp, {
                new: true,
                useFindAndModify: false
            });
            return res.status(201).json({
                    'message': 'Images saved successfully',
                    'data': imageDoc
                });
        }else{
            const imageDoc = await ImageDoc.create(temp)
            if (imageDoc) {
                return res.status(201).json({
                    'message': 'Images saved successfully',
                    'data': imageDoc
                });
               
            } else {
                throw new Error('something went wrong');
            }
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const readImage = async (req,res,next) => {
    try{
        const image = await ImageDoc.find({id_code : mongoose.Types.ObjectId(req.params.id)})
        if(image.length > 0){
            return res.status(200).json({
                'message': 'Images fetched successfully',
                'data': image
            });
        }else{
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No images found in the system'
            });
        }
    }catch (error) {
            console.log(error)
            return res.status(500).json({
                'code': 'SERVER_ERROR',
                'description': 'something went wrong, Please try again'
            });
        }
}
module.exports = {
            read: read, 
            create: create, 
            readid: readid, 
            update: update, 
            remove: remove,
            coderead: coderead,
            approval: approval,
            approving1: approving1,
            approving2, approving2,
            cancel: cancel,
            readcancel: readcancel,
            settlementcreate: settlementcreate,
            readSettled: readSettled,
            readsettledid: readsettledid,
            accepted: accepted,
            invoiceaccepted: invoiceaccepted,
            uploadImage: uploadImage,
            readImage: readImage
        }