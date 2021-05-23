const User = require('../models/userModel');
const bcrypt = require('bcryptjs')

exports.signUp = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashPassword
        });

        req.session.user = newUser;
        res.status(200).json({
            status: 'success',
            newUser
        })
    } catch(e) {
        res.status(400).json({
            status: 'fail',
            error: JSON.stringify(e)
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(400).json({
                status: 'fail',
                error: 'Not found'
            })
        }

        const match = await bcrypt.compare(password, user.password)

        if(match) {
            req.session.user = user;
            return res.status(200).json({
                status: 'success'
            })
        } else {
            return res.status(400).json({
                status: 'fail',
                error: 'Incorrect password'
            })
        }
    } catch(e) {
        console.log('Error', e)
        return res.status(400).json({
            status: 'fail',
            error: JSON.stringify(e)
        })
    }
}
