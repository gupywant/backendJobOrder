const express = require('express');
const Service = require('../../models/service');
const mongoose = require('mongoose');
const Transaction = require('../../models/transaction');
const CustomerService = require('../../models/customer_service');

const create = async (req,res,next) => {
    try{
    	const {
            name,
            description
        } = req.body;

        let code = 0
        let sCode = await Service.find({})
        if(!sCode.length){
            code = 1
        }else{
            const no = await Service.find({}).sort({"code" : -1})
            console.log(no[0].code)
            code = no[0].code + 1
        }
        const temp = {
            code,
        	name,
        	description
        }
    	let newService = await Service.create(temp);
        if (newService) {
            return res.status(201).json({
                'message': 'Service created successfully',
                'data': newService
            });
        } else {
            throw new Error('something went worng');
        }
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const update = async (req,res,next) => {
    try{
        const {
            name,
            description,
        } = req.body;

        let isExists = await Service.findById(req.params.id);

        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No service found in the system'
            });
        }
        const temp = {
            name,
            description
        }
        let updateService = await Service.findByIdAndUpdate(req.params.id, temp, {
            new: true,
            useFindAndModify: false
        });
        if(updateService) {
            return res.status(200).json({
                'message': 'Service updated successfully',
                'data': updateService
            });
        }
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const read = async (req,res,next) => {
    try{
        let service = await Service.find({});

        if (service.length > 0) {
            return res.status(200).json({
                'message': 'Services fetched successfully',
                'data': service
            });
        }
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No services found in the system'
        });
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const remove = async (req,res,next) => {
    try{
        let id_service = req.params.id;

        let isExists = await Service.findById(id_service);

        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No Service found in the system'
            });
        }

        let service = await Service.findByIdAndRemove(id_service);
        let customerService = await CustomerService.deleteMany({id_service: mongoose.Types.ObjectId(id_service)});
        let transaction = await Transaction.deleteMany({id_service: mongoose.Types.ObjectId(id_service)});
        if (service && customerService && transaction) {
            return res.status(200).json({
                'message': `Service with id ${id_service} deleted successfully`
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
module.exports = {create:create,update:update,read:read,remove:remove}