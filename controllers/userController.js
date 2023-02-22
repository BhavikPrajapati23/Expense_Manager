const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Account = require('../model/account')
const Transaction = require('../model/transaction')
const nodemailer = require('nodemailer')
const secretkey = 'expesnemanage'

const signup = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.send('User Already Exists')
        }

        if (password.length < 8) {
            return res.send('Password must be at least 8 characters long')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const token = jwt.sign({ email: email }, secretkey)
        const user = await new User({
            email: email,
            password: hashedPassword,
            token: token
        })

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true
        })

        const save = await user.save();

        // if (save) {

        //     const transporter = nodemailer.createTransport(
        //         {
        //             service: 'gmail',
        //             auth:{
        //                 user: '',
        //                 pass: ''
        //             }
        //         }
        //     );

        //     const mailOptions = {
        //         from: '', // sender address
        //         to: save.email, // list of receivers
        //         subject: 'Welcome!',
        //         text: "Hello world?", // plain text body
        //         html: "<b>Hello world?</b>", // html body
        //     };


        //using fake smtp server

        //     transporter.sendMail(mailOptions, function(error, info){
        //         if(error){
        //             return console.log(error);
        //         }
        //         console.log('Message sent: ' + info.response);
        //     });

            //create reusable transporter object using the default SMTP transport
        //     let transporter = nodemailer.createTransport({
        //         host: "smtp.ethereal.email",
        //         port: 587,
        //         auth: {
        //             user: 'sven.mcglynn68@ethereal.email', // generated ethereal user
        //             pass: 'Cf8hk3q1J5e3S9BJ4n', // generated ethereal password
        //     },
        // });

        // send mail with defined transport object
        // let info = await transporter.sendMail({
        //     from: '"Expense Manager" <expensemanager@gmail.com>', // sender address
        //     to: save.email, // list of receivers
        //     subject: "Hello ", // Subject line
        //     text: "Hello world?", // plain text body
        //     html: "<b>Hello world?</b>", // html body
        // });
        //}
        //let testAccount = await nodemailer.createTestAccount();

        res.render('login', { data: user, token: token })
    } catch (error) {
        throw error
    }
}

const home = async (req, res) => {
    const { email, password } = req.body

    try {

        const existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            return res.send('user not found')
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password)
        if (!matchPassword) {
            return res.send('Invalid Credintials.')
        }

        const token = jwt.sign({ email: existingUser.email }, secretkey)

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true
        })

        req.session.user = existingUser._id
        req.session.save()
        const ac = await Account.find({ user: existingUser._id })

        res.render('home', {data: existingUser, token: token, ses: req.session.user, ac: ac })

    } catch (error) {
        throw error
    }
}


//account add 
const acadd = async (req, res) => {
    const { name } = req.body
    try {
        const account = await new Account({
            name: name,
            user: req.session.user
        })

        const save = await account.save()

        //const ac = await Account.find({ name: save.name })

        res.redirect('/home/acadd')
        //res.render('home',{ses: req.session.user,ac: ac})
        console.log(save)
    } catch (error) {
        throw error
    }
}

//account update
const update = async (req, res) => {
    const name = req.body.name
    const id = req.params._id

    Account.findOneAndUpdate({ _id: id }, {
        $set: {
            name: name
        }
    })
        .then((result) => {
            return res.redirect('/edit/'+name+'/'+id)
        }).catch((err) => {
            throw err
        });

}


//add transaction in account
const addtransaction = async (req, res) => {
    const { name, category, amount, transaction } = req.body
    const id = req.params.id

    try {
        const transac = await new Transaction({
            name: name,
            category: category,
            amount: amount,
            transaction: transaction,
            account: id
        })
        const data = [];
        data.push(transac)
        const save = await transac.save()
        const acid = save.account.toString()
        return res.redirect('/transaction/'+id+'/'+name)
        //res.render('transaction', { data: data, id: id, name: name, acid: acid })

    } catch (error) {
        throw error
    }
}


//view transaction of account
const viewtransaction = async (req, res) => {
    const { id, name } = req.params
    
    try {
        Transaction.find().sort({createdAt: -1})
            .then((result) => {
                let data = result.filter((data) => {
                    if (data.account.toString() == id) {
                        return data;
                    }
                })
                if(data){
                    res.render('viewtransaction',{data: data,acid: id,name: name})
                }else{
                    res.send('No Transaction')
                }
                
            });
    } catch (error) {
        throw error
    }
}


//Transaction update
const transupdate = async (req,res) => {
    const {category,amount,transaction} = req.body
    const name = req.params.name
    const acid = req.params.acid
    const id = req.params.id

    Transaction.findOneAndUpdate({ _id: id }, {
        $set: {
            category: category,
            amount: amount,
            transaction: transaction
        }
    })
        .then((result) => {
            return res.redirect('/transaction/'+acid+'/'+name)
            //res.redirect('/transaction/<%= acid %>/<%= name %>')
        }).catch((err) => {
            throw err
        });
}

module.exports = { signup, home, acadd, update, addtransaction, viewtransaction, transupdate }