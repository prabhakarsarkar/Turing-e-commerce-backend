const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const verifytoken = require('./middile/verifytoken')
// console.log(verify);


var knex = require('knex')({
    client:'mysql',
    connection:{
        host:'localhost',
        user:'root',
        password:'sarkar123',
        database:'turing'
    }
})
app.use(express.json());
app.use(cookieParser());

const departments = express.Router();
app.use('/',departments)
require('./routers/department')(departments,knex)


const categories = express.Router();
app.use('/',categories)
require('./routers/category')(categories,knex)

const  attribute = express.Router();
app.use('/',attribute)
require('./routers/attribute')(attribute,knex)

const products = express.Router();
app.use('/',products)
require('./routers/product')(products,knex)

const customer = express.Router();
app.use('/',customer)
require("./routers/customer")(customer,knex,jwt)

const shoppingcart = express.Router();
app.use("/",shoppingcart)
require('./routers/shoppingcart')(shoppingcart,knex)

const tax = express.Router();
app.use("/",tax)
require('./routers/tax')(tax,knex)

const shipping = express.Router();
app.use("/",shipping)
require('./routers/shipping')(shipping,knex)

const orders = express.Router();
app.use("/",orders)
require("./routers/orders")(orders,knex,verifytoken,jwt)
app.listen(3000,(s)=>{  
    console.log("server in woring port 3000");
    
})

