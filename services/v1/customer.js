const express = require('express');
const Customer = require('../../models/customer');
const mongoose = require('mongoose');
const Transaction = require('../../models/transaction');
const TransactionCode = require('../../models/transaction_code');
const CustomerService = require('../../models/customer_service');

const create = async (req,res,next) => {
    try{
        const {
            name,
            email,
            phone, 
            npwp,
            address,
            province,
            postalCode,
            country,
            attn
        } = req.body;
        //check email
        let emailCheck = await Customer.find({email: email});
        if(emailCheck.length){
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'Email already used'
            });
        }
        let CustomerCode = 0
        let cCode = await Customer.find({})
        if(!cCode.length){
            CustomerCode = 1
        }else{
            const no = await Customer.find({}).sort({"code" : -1})
            console.log(no[0].code)
            CustomerCode = no[0].code + 1
        }
        const temp = {
            code:CustomerCode,
            name:name,
            email:email,
            phone:phone,
            npwp:npwp,
            address:address,
            province:province,
            postalCode:postalCode,
            country,
            attn
        };
        let newCustomer = await Customer.create(temp);
        if (newCustomer) {
            return res.status(201).json({
                'message': 'Customer created successfully',
                'data': newCustomer
            });
        } else {
            throw new Error('something went worng');
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
        let customer = await Customer.find({});

        if (customer.length > 0) {
            return res.status(200).json({
                'message': 'Customers fetched successfully',
                'data': customer
            });
        }
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No cutomers found in the system'
        });
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const readid = async (req,res,next) => {
    try{
        let customer = await Customer.findById(req.params.id);
        if (customer) {
            return res.status(200).json({
                'message': 'Customer fetched successfully',
                'data': customer
            });
        }
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No customer found in the system'
        });
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
            email,
            phone, 
            npwp,
            address,
            province,
            postalCode,
            country,
            attn
        } = req.body;
        const temp = {
            name: name,
            email: email,
            phone: phone, 
            npwp: npwp,
            address: address,
            province: province,
            postalCode: postalCode,
            country: country,
            attn: attn
        }
        let isExists = await Customer.findById(req.params.id);

        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No customer found in the system'
            });
        }
        let updateCustomer = await Customer.findByIdAndUpdate(req.params.id, temp, {
            new: true,
            useFindAndModify: false
        });

        if(updateCustomer) {
            return res.status(200).json({
                'message': 'Customer updated successfully',
                'data': updateCustomer
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
const remove = async (req,res,next) => {
    try{
        let id_customer = req.params.id;

        let isExists = await Customer.findById(id_customer);

        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No customer found in the system'
            });
        }

        let customer = await Customer.findByIdAndRemove(id_customer);
        let customerService = await CustomerService.deleteMany({id_customer: mongoose.Types.ObjectId(id_customer)});
        let transaction = await Transaction.deleteMany({id_customer: mongoose.Types.ObjectId(id_customer)});
        let transactionCode = await TransactionCode.deleteMany({id_customer: mongoose.Types.ObjectId(id_customer)});
        if (customer) {
            return res.status(200).json({
                'message': `Customer with id ${id_customer} deleted successfully`
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

module.exports = {create:create,update:update,read:read,remove:remove,readid:readid}

