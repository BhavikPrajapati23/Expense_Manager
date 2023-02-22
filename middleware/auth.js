const jwt = require('jsonwebtoken')
const User = require('../model/user')
const secretkey = 'expesnemanage'

const auth = async (req,res,next) => {
    try {

        if (req.session.user){}
        else{
            res.redirect('/login')
        }
        
        next();

    } catch (error) {
        console.log('unauthorized user')
    }
}

const logout = async (req,res,next) => {
    try {
        if (req.session.user){
            res.redirect('/home')
        }
        next();
    } catch (error) {
        console.log('unauthorized')
    }
}

module.exports = {auth,logout}