const express = require('express');
const mongoose = require('mongoose');
const ApprovalSetting = require('../../models/approval_setting');

const save = async (req,res,next) => {
	try{
		const {
			approval1,
			approval2
        } = req.body;
		const check = await ApprovalSetting.find({})
		if(check.length > 0){
			await ApprovalSetting.findOneAndUpdate(
	        	{
	        		id_approval: 1
	        	},
	        	{
					id_user: approval1
	        	},
	        	{
	            	new: true,
	            	useFindAndModify: false
	        	}
	        )
	        await ApprovalSetting.findOneAndUpdate(
	        	{
	        		id_approval: 2
	        	},
	        	{
					id_user: approval2
	        	},
	        	{
	            	new: true,
	            	useFindAndModify: false
	        	}
	        )
		}else{
			const temp = [{
				id_approval: 1,
				id_user: approval1
			},{
				id_approval: 2,
				id_user: approval2
			}]
			await ApprovalSetting.insertMany(temp)
		}
		return res.status(200).json({
            'description': 'Approval Setting has ben saved successfully'
        });
	}catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}
const read = async (req,res,next) => {
	try{
		const approval = await ApprovalSetting.aggregate([      	
        	{ 
        		$lookup:
        			{
	        			from: 'users',
	        			localField: 'id_user',
	        			foreignField: '_id',
	        			as: 'user_detail'
	        		}
        	},
        	{   $unwind:"$user_detail" },
        	{   
		        $project:{	
		            id_user : 1,
		            planned_amount: 1,
		            name : "$user_detail.name",
		        } 
		    }
        ])
		console.log(approval.length)
		if(approval.length > 0){
			return res.status(200).json({
            	'description': 'Approval Setting has ben saved successfully',
            	'data': approval
        	});
		}else{
			return res.status(404).json({
            	'description': 'Approval Setting not found'
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

module.exports = {save: save, read: read}