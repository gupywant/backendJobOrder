const express = require('express');
const { isValidObjectId } = require('mongoose');
const User = require('../../models/user');
const Auth = require('../v1/auth');


const test = (req,res,next) => {
    return res.status(200).json({
        'message': 'test'
    }); 
}

const createUser = async (req,res,next) => {
    try{

        const {
            email,
            name,
            password,
            active,
            role,
            department,
            image
        } = req.body;

        const temp = {
            email: email,
            name: name,
            password:Auth.encryptPassword(password),
            active:active,
            role:role,
            department:department,
            image:image
        }

        let newUser = await User.create(temp);

        if (newUser) {
            return res.status(201).json({
                'message': 'user created successfully',
                'data': newUser
            });
           
        } else {
            throw new Error('something went wrong');
        }
    }
    catch (e) {

    }
}

const getAllUserList = async (req,res,next) => {
    try {
        //console.log(req.headers.authorization)
        let users = await User.find({});

        if (users.length > 0) {
            return res.status(200).json({
                'message': 'users fetched successfully',
                'data': users
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });
    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const getUserById = async (req, res, next) => {
    try {
        //console.log(req.query);
        console.log(">> " + req.query.id);
        let user = await User.findById(req.query.id);
        //console.log(user);
        if (user) {
            return res.status(200).json({
                'message': `user with id ${req.query.id} fetched successfully`,
                'data': user
            });
        }


        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });

    } catch (error) {

        return res.status(500).json({
            'error' : req.query.id,
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const updateUser = async (req, res, next) => {
    try {
        const {
            _id,
            name,
            image,
            active,
            role,
            department,
        } = req.body;

        const userId = _id;

        if (name === undefined || name === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'name is required',
                'field': 'name'
            });
        }

        /*if (email === undefined || email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'email is required',
                'field': 'email'
            });
        }*/


        let isUserExists = await User.findById(userId);

        if (!isUserExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No user found in the system'
            });
        }

        const temp = {
            name: name,
            image:image,
            active:active,
            role:role,
            department:department,
        }

        let updateUser = await User.findByIdAndUpdate(userId, temp, {
            new: true
        });

        if (updateUser) {
            return res.status(200).json({
                'message': 'user updated successfully',
                'data': updateUser
            });
        } else {
            throw new Error('something went wrong');
        }
    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const deleteUser = async (req, res, next) => {
    try {
        let id = req.params.id;

        let user = await User.findByIdAndRemove(id);
        if (user) {
            return res.status(200).json({
                'message': `user with id ${id} deleted successfully`
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });

    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

module.exports = {createUser:createUser,getAllUserList:getAllUserList,getUserById:getUserById,updateUser:updateUser,deleteUser:deleteUser}
