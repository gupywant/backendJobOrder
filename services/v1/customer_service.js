const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../../models/transaction');
const CustomerService = require('../../models/customer_service');
const Service = require('../../models/service');

const create = async (req,res,next) => {
	try{
        let newCustomerService = null;
        let itemData = null;
        let temp = null;
        if(req.body.edit){
            const {
                id_customer,
                id_service,
                id_vendor,
                id_code
            } = req.body;
            temp = {
                id_code: mongoose.Types.ObjectId(id_code),
                id_service: mongoose.Types.ObjectId(id_service)
            }
            const isExists = await Transaction.find(temp)
            console.log(isExists.length)
            if (isExists.length) {
                return res.status(404).json({
                    'code': 'BAD_REQUEST_ERROR',
                    'description': 'Service already selected'
                });
            }else{
                const temps = {
                    id_code: id_code,
                    id_customer: id_customer,
                    id_service: id_service,
                    id_vendor: id_vendor,
                    qty: 0,
                    planned_amount: 0
                }
                let newTransaction = await Transaction.create(temps);
            }
        }else if(req.body.add){
            const {
                id_customer: id_customer,
                id_service: id_service
            } = req.body;
            temp = {
                id_customer: mongoose.Types.ObjectId(id_customer),
                id_service: mongoose.Types.ObjectId(id_service)
            }
            const isExists = await CustomerService.find(temp)
            console.log(isExists.length)
            if (isExists.length) {
                return res.status(404).json({
                    'code': 'BAD_REQUEST_ERROR',
                    'description': 'Service already selected'
                });
            }else{
                newCustomerService = await CustomerService.create(temp);
            }
        }else{     
            const {
                id_customer,
                selected
            } = req.body;
            await selected.forEach(async (item) => {
                if(item.select){
                    temp = {
                        id_customer: id_customer,
                        id_service: item._id
                    }
                    newCustomerService = await CustomerService.create(temp);
                }
            })
        }
        return res.status(201).json({
            'message': 'Customer Service added successfully'
        });
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
        let customerService = await CustomerService.aggregate([
        	{ "$match" : {
                id_customer: mongoose.Types.ObjectId(req.params.id)
                }
            },
        	{ $lookup: {
        		  from: 'services',
        		  localField: 'id_service',
        		  foreignField: '_id',
        		  as: 'service_detail'
                }
        	},
            {   $unwind:"$service_detail" },
            {   
                $project:{
                    _id: "$service_detail._id",
                    name : "$service_detail.name",
                    description : "$service_detail.description",
                    createdAt: "$service_detail.createdAt",
                    updatedAt: "$service_detail.updatedAt",
                    __v: 1
                } 
            }
        ])
        if (customerService.length > 0) {
            return res.status(200).json({
                'message': 'Service for this customer fetched successfully',
                'data': customerService
            });
        }
        console.log(customerService)
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No service found for this customer'
        });
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const readidavail = async (req,res,next) => {
    try{
        let customerService = await CustomerService.aggregate([
        	{ 	"$match" : {
        			id_customer: mongoose.Types.ObjectId(req.params.id)
        		} 
        	},
        	{ 	$lookup:{
        			from: 'services',
	        		localField: 'id_service',
	        		foreignField: '_id',
	        		as: 'service_detail'
	        	}
        	},
            {   $unwind:"$service_detail" },
        	{   
		        $project:{
		            id_service : 1,
		            name : "$service_detail.name",
                    description : "$service_detail.description"
		        } 
		    }
        ])
        let amount = []
        let result = await Transaction.find({id_customer: mongoose.Types.ObjectId(req.params.id)})
        await amount.push(result)
        console.log(result)
        if (customerService.length > 0) {
            return res.status(200).json({
                'message': 'Service for this customer fetched successfully',
                'data': customerService,
                'amount': amount[0]
            });
        }
        console.log(customerService)
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No service found for this customer'
        });
    }catch (error) {
    	console.log(error)
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const remove = async (req,res,next) => {
    try{
        
        const {
            id_customer: id_customer,
            id_service: id_service
        } = req.body;

        let isExists = await CustomerService.find({id_customer: mongoose.Types.ObjectId(id_customer), id_service: mongoose.Types.ObjectId(id_service)});

        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No service found for this customer'
            });
        }

        temp = {
            id_customer: mongoose.Types.ObjectId(id_customer),
            id_service: mongoose.Types.ObjectId(id_service)
        }
        let allTransaction = await Transaction.deleteOne(temp)
        let customerService = await CustomerService.deleteOne(temp);
        if (customerService) {
            return res.status(200).json({
                'message': `Service with customer id ${id_customer} deleted successfully`
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
const deleteAll = async (req,res,next) => {
	try{
		let id = req.params.id;

        let isExists = await CustomerService.find({id_customer: mongoose.Types.ObjectId(id)});

        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No service found for this customer'
            });
        }

        let allTransaction = await Transaction.deleteMany({id_customer: mongoose.Types.ObjectId(id)})
        let customerService = await CustomerService.remove({id_customer: mongoose.Types.ObjectId(id)});
        if (customerService) {
            return res.status(200).json({
                'message': `Service with customer id ${id} deleted successfully`
            });
        }

	}catch{
		return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
	}
}

module.exports = {create:create, readid: readid, deleteAll: deleteAll, readidavail: readidavail, remove: remove}