const express = require('express');
const Vendor = require('../../models/vendor');
const mongoose = require('mongoose');
const Transaction = require('../../models/transaction');
const CustomerService = require('../../models/customer_service');

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

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
        let code = 0
        let vCode = await Vendor.find({})
        if(!vCode.length){
            code = 1
        }else{
            const no = await Vendor.find({}).sort({"code" : -1})
            console.log(no[0].code)
            code = no[0].code + 1
        }
        const temp = {
            code:code,
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
        //check email
        let emailCheck = await Vendor.find({email: email});
        if(emailCheck.length){
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'Email already used'
            });
        }

        let newVendor = await Vendor.create(temp);

        if (newVendor) {
            return res.status(201).json({
                'message': 'Vendor created successfully',
                'data': newVendor
            });
        } else {
            throw new Error('something went worng');
        }

    }catch (e) {

    }
}
const read = async (req,res,next) => {
    try{
        let vendor = await Vendor.find({});

        if (vendor.length > 0) {
            return res.status(200).json({
                'message': 'Vendors fetched successfully',
                'data': vendor
            });
        }
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No vendors found in the system'
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
        let vendor = await Vendor.findById(req.params.id);
        if (vendor) {
            return res.status(200).json({
                'message': 'Vendor fetched successfully',
                'data': vendor
            });
        }
        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No vendor found in the system'
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

        let isExists = await Vendor.findById(req.params.id);

        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No vendor found in the system'
            });
        }
        const temp = {
            name,
            email,
            phone, 
            npwp,
            address,
            province,
            postalCode,
            country,
            attn
        }

        let updateVendor = await Vendor.findByIdAndUpdate(req.params.id, temp, {
            new: true,
            useFindAndModify: false
        });

        if(updateVendor) {
            return res.status(200).json({
                'message': 'Vendor updated successfully',
                'data': updateVendor
            });
        }
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }

}
const remove = async (req,res,next) => {
    try{
        let id_vendor = req.params.id;

        let isExists = await Vendor.findById(id_vendor);

        if (!isExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No vendor found in the system'
            });
        }

        let vendor = await Vendor.findByIdAndRemove(id_vendor);
        let allTransaction = await Transaction.find({id_vendor: mongoose.Types.ObjectId(id_vendor)})
        allTransaction.map(async (item) => {
            await CustomerService.findOneAndUpdate(
                {
                    id_service: mongoose.Types.ObjectId(allTransaction[0].id_service)
                },
                {
                    available: true
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            )
        })
        console.log(allTransaction);
        let transaction = await Transaction.deleteMany({id_vendor: mongoose.Types.ObjectId(id_vendor)});
        if (vendor) {
            return res.status(200).json({
                'message': `Vendor with id ${id_vendor} deleted successfully`
            });
        }
    }catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

module.exports = {create:create,update:update,read:read,remove:remove,readid:readid}

