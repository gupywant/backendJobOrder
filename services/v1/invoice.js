const express = require('express');
const mongoose = require('mongoose');
const TransactionCode = require('../../models/transaction_code');
const Invoice = require('../../models/invoice');
const InvoiceReg = require('../../models/invoice_reg');
const InvoiceNonreg = require('../../models/invoice_nonreg');

const create = async (req,res,next) => {
	try{
		const {
			customer,
			code,
			ppn,
			pph,
			type
		} = req.body



		let codeI = 0
        let tCode = await Invoice.find({})
        if(!tCode.length){
            codeI = 1
        }else{
            const no = await Invoice.find({}).sort({"code" : -1})
            codeI = no[0].code + 1
        }
		const temp = {
			id_customer: customer._id,
			code: codeI,
			type: type,
			ppn: ppn,
			pph: pph
		}
		const invoice = await Invoice.create(temp)
		let total_amount = parseInt(ppn)+parseInt(pph)
		if(type === 1){
			await code.map(async (item) => {
				if(item.select){
					await InvoiceReg.create({
						id_invoice: mongoose.Types.ObjectId(invoice._id),
						id_code: mongoose.Types.ObjectId(item._id),
						po_ref: item.ref,
						total_amount: item.settlement_amount
					})
					total_amount += await (parseInt(item.settlement_amount))

					const update = {
						total_amount : total_amount
					}
					console.log(total_amount)
					await Invoice.findOneAndUpdate({_id: mongoose.Types.ObjectId(invoice._id)}, update, {
			                new: true,
			                useFindAndModify: false
			            });
				}
			})
			
			return res.status(200).json({
	            'message': 'Invoice created successfully',
	            'id': invoice._id
	        });
		}else{
			await code.map(async (item) => {
				if(item.select){
					await InvoiceNonreg.create({
						id_invoice: mongoose.Types.ObjectId(invoice._id), 
						id_code: mongoose.Types.ObjectId(item._id), 
						po_ref: item.ref, 
						qty: item.qty,
						total_amount: item.settlement_amount
					})
					total_amount += await (parseInt(item.settlement_amount)*parseInt(item.qty))

				
					const update = {
						total_amount : total_amount
					}
					await Invoice.findOneAndUpdate({_id: mongoose.Types.ObjectId(invoice._id)}, update, {
			                new: true,
			                useFindAndModify: false
			            });
				}
			})

			return res.status(200).json({
	            'message': 'Invoice created successfully',
	            'id': invoice._id
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
		const id = req.params.id
		const data = await Invoice.aggregate([
			{   
				"$match" : {
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
                $project:
                    {
                    	_id: 1,
                        total_amount: 1,
                        code: 1,
                        type: 1,
                        customer_code : "$customer_detail.code",
                        createdAt: 1,
                        updatedAt: 1
                    } 
            }
        ])
        if(data.length > 0){
			return res.status(200).json({
	            'message': 'Invoice fetched successfully',
	            'data': data
	        });
       }else{
       		return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No invoice found in the system'
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
const readid = async (req,res,next) => {
	try{
		const id = req.params.id
		const invoice = await Invoice.find({_id: mongoose.Types.ObjectId(req.params.id)})
		console.log(invoice[0].type)
		if(invoice[0].type === 1){
			const data = await Invoice.aggregate([
				{   
					"$match" : {
	                    _id: mongoose.Types.ObjectId(req.params.id),
	                    cancel: false
	                }
	            },
	            { 
	                $lookup: 
	                    {
	                        from: 'invoiceregs',
	                        localField: '_id',
	                        foreignField: 'id_invoice',
	                        as: 'invoice_detail'
	                    }
	            },
	            {   $unwind:"$invoice_detail" },
	            { 
	                $lookup: 
	                    {
	                        from: 'transactioncodes',
	                        localField: 'invoice_detail.id_code',
	                        foreignField: '_id',
	                        as: 'transaction_detail'
	                    }
	            },
	            {   $unwind:"$transaction_detail" },
	            /*{ 
	                $lookup: 
	                    {
	                        from: 'vendors',
	                        localField: 'transaction_detail.id_vendor',
	                        foreignField: '_id',
	                        as: 'vendor_detail'
	                    }
	            },
	            {   $unwind:"$vendor_detail" },*/
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
	                    	settlement: "$invoice_detail.settlement",
	                    	_id: 1,
	                    	id_customer: 1,
	                        total_amount: 1,
	                        code: 1,
	                        ppn: 1,
	                        pph: 1,
	                        po_ref: "$invoice_detail.po_ref",
	                        amount: "$invoice_detail.total_amount",
	                        transaction_code: "$transaction_detail.code",
	                        //vendor_code: "$vendor_detail.code",
	                        type: 1,
	                        id_code: "$invoice_detail.id_code",
	                        customer_code : "$customer_detail.code",
	                        customer_name : "$customer_detail.name",
	                        createdAt: 1,
	                        updatedAt: 1
	                    } 
	            }
	        ])
	        if(data.length > 0){
				return res.status(200).json({
		            'message': 'Invoice fetched successfully',
		            'data': data
		        });
		    }else{
		    	return res.status(404).json({
		            'code': 'NOT_FOUND',
		            'description': 'No invoice found in the system'
		        });
		    }
		}else{
			const data = await Invoice.aggregate([
				{   
					"$match" : {
	                    _id: mongoose.Types.ObjectId(req.params.id),
	                    cancel: false
	                }
	            },
	            { 
	                $lookup: 
	                    {
	                        from: 'invoicenonregs',
	                        localField: '_id',
	                        foreignField: 'id_invoice',
	                        as: 'invoice_detail'
	                    }
	            },
	            {   $unwind:"$invoice_detail" },
	            { 
	                $lookup: 
	                    {
	                        from: 'transactioncodes',
	                        localField: 'invoice_detail.id_code',
	                        foreignField: '_id',
	                        as: 'transaction_detail'
	                    }
	            },
	            {   $unwind:"$transaction_detail" },
	            /*{ 
	                $lookup: 
	                    {
	                        from: 'vendors',
	                        localField: 'transaction_detail.id_vendor',
	                        foreignField: '_id',
	                        as: 'vendor_detail'
	                    }
	            },
	            {   $unwind:"$vendor_detail" },*/
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
	                    	settlement: "$invoice_detail.settlement",
	                    	_id: 1,
	                    	id_customer: 1,
	                        total_amount: 1,
	                        code: 1,
	                        ppn: 1,
	                        pph: 1,
	                        qty: "$invoice_detail.qty",
	                        po_ref: "$invoice_detail.po_ref",
	                        amount: "$invoice_detail.total_amount",
	                        transaction_code: "$transaction_detail.code",
	                        //vendor_code: "$vendor_detail.code",
	                        type: 1,
	                        id_code: "$invoice_detail.id_code",
	                        customer_code : "$customer_detail.code",
	                        customer_name : "$customer_detail.name",
	                        createdAt: 1,
	                        updatedAt: 1
	                    } 
	            }
	        ])

			if(data.length > 0){
				return res.status(200).json({
		            'message': 'Invoice fetched successfully',
		            'data': data
		        });
		    }else{
		    	return res.status(404).json({
		            'code': 'NOT_FOUND',
		            'description': 'No invoice found in the system'
		        });
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

const cancel = async (req,res,next) => {
	try{
		const id = req.params.id
		const update = {
            cancel: true
        }
        let updateTransactioncode = await Invoice.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, update, {
                new: true,
                useFindAndModify: false
            });
        return res.status(200).json({
	            'message': 'Invoice canceled successfully',
	            'data': updateTransactioncode
	        });
	}catch (error) {
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const settle = async (req,res,next) => {
	try{

		const {
			invoice,
			type
		} = req.body
		await invoice.map(async (item) => {
			console.log(item._id)
			console.log(item.id_code)
			const update = {
	            settlement: item.settlement
	        }
	        if(item.type === 1){
	        	await InvoiceReg.findOneAndUpdate({id_invoice: mongoose.Types.ObjectId(item._id), id_code: mongoose.Types.ObjectId(item.id_code)}, update, {
	                new: true,
	                useFindAndModify: false
	            });
	        }else{
	        	await InvoiceNonreg.findOneAndUpdate({id_invoice: mongoose.Types.ObjectId(item._id), id_code: mongoose.Types.ObjectId(item.id_code)}, update, {
	                new: true,
	                useFindAndModify: false
	            });
	        }
	        /*let updateInvoice = await InvoiceReg.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, update, {
                new: true,
                useFindAndModify: false
            });*/
		})
		/*const id = req.params.id
		const update = {
            settlement: true
        }*/
        //const invoice = await InvoiceReg.findOne({_id: mongoose.Types.ObjectId(id)})

        /*let updateInvoice = await InvoiceReg.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, update, {
                new: true,
                useFindAndModify: false
            });*/
        return res.status(200).json({
	            'message': 'Invoice canceled successfully',
	            //'data': updateTransactioncode
	        });
	}catch (error) {
        console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

module.exports = {
	create: create,
	read: read,
	readid: readid,
	cancel: cancel,
	settle: settle
}