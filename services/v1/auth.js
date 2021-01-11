const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

function encryptPassword (password) {
    return bcrypt.hashSync(password, 8);   
}

const authenticateLogin = async (req, res, next) => {
    
    const {
        email,
        password,
    } = req.body.userDetails;
    try{
        let user = await User.find({"email": email}) ;
        if (user.length != 0) {    
            if (user[0].email == email && bcrypt.compareSync(password, user[0].password)) {
             
                const options = {
                    expiresIn: '1d'
                  };

            var token = jwt.sign({ id: user[0]._id },"inih salt key buat encrypt",options);

            return res.status(200).json({
                'message': `user with id ${email} fetched successfully`,
                'data': { auth: true,id: user[0]._id ,token:token, name: user[0].name, image: user[0].image }
            });
            }else{
                res.status(401).send({ auth: false, message: 'Credential Error 2' });        
            }
        }else{
            res.status(401).send({ auth: false, message: 'Credential Error' });
        }
    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

module.exports = {encryptPassword:encryptPassword,authenticateLogin:authenticateLogin}