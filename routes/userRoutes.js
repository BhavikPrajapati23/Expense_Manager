const express = require('express')
const { signup, home, acadd, update, addtransaction, viewtransaction, transupdate } = require('../controllers/userController')
const router = express.Router()
const bodyParser = require('body-parser')
const {auth,logout} = require('../middleware/auth')
const session = require('express-session')
const account = require('../model/account') 
const Transaction = require('../model/transaction')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

router.use(session({ secret: "secretpass" }))

//signup routes
router.get('/',logout,(req,res) => {
    res.render('signup')
})

//login route
router.get('/login',logout,(req,res) => {
    res.render('login')
})

//account add route
router.get('/acadd',auth,(req,res) => {
    res.render('acform',{ses: req.session.user})
})

//trasaction add route
router.get('/transaction/:id/:name',auth,(req,res) => {
    return res.render('addtransaction',{name: req.params.name,id: req.params.id})
})

//route for add account form
router.get('/home/acadd',auth,(req,res) => {
    return res.render('acform',{ses: req.session.user})
})

//route for edit account name
router.get('/edit/:name/:_id',auth,(req,res) => {
    const id = req.params._id
    const name = req.params.name
    res.render('edform',{id: id,name: name})
})

//route for edit transaction
router.get('/transedit/:acid/:name/:category/:amount/:transaction/:_id',auth,(req,res) => {
    const acid = req.params.acid
    const name = req.params.name
    const category = req.params.category
    const amount = req.params.amount
    const transaction = req.params.transaction
    const id = req.params._id

    return res.render('transactionedt',{acid: acid,name: name,category: category,amount: amount,transaction: transaction,id: id})
})

//route for delete transaction 
router.get('/transedelete/:id',auth,(req,res) => {
    const id = req.params.id

    Transaction.deleteOne({_id: id})
        .then((result) => {
            //res.redirect('/home')
            res.send('Transaction Deleted.')
        }).catch((err) => {
            throw err
        });
})

//route for view transaction
router.get('/view/:name/:_id',auth,(req,res) => {
    const id = req.params._id
    const name = req.params.name
    res.render('transaction',{id: id,name: name})
})

//route for delete account
router.get('/delete/:name/:_id',auth,(req,res) => {
    const name = req.params.name
    const id= req.params._id

    account.deleteOne({_id: id}).exec();
    Transaction.deleteMany({name: name}).exec();
    res.send("Account deleted.")

})

//route for home after succesful login
router.get('/home',auth,(req,res) => {
    res.render('home',{ses: req.session.user})
})

//route for logout 
router.get('/logout',auth, async(req,res) => {
    
    try {
        req.session.destroy();
        console.log('logout succesfully')
        res.redirect('/login')
    } catch (error) {
        throw error
    }
})

router.post('/signup',urlencodedParser,signup) //route for signup post request
router.post('/home',urlencodedParser,home) //route for home post request
router.post('/acadd',urlencodedParser,acadd) //route for add account data in database
router.post('/update/:name/:_id',urlencodedParser,update) //route for update account name 
router.post('/addtransaction/:id',urlencodedParser,addtransaction) //route for add transaction in database
router.post('/transaction/:id/:name',urlencodedParser,viewtransaction) //route for view transaction data
router.post('/transupdate/:acid/:name/:category/:amount/:transaction/:id',urlencodedParser,transupdate) //route for update transction data

module.exports = router