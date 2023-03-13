const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function listOrders(req, res, next){
    res.json({data: orders})
}

function validateBody(req, res, next){
    const {data: { deliverTo, mobileNumber, dishes} = {}} = req.body;
    if(!deliverTo || deliverTo === ""){
        res.status(400).json({error: "Order must include a deliverTo"})
    }
    if(!mobileNumber || mobileNumber === ""){
        res.status(400).json({error: "Order must include a mobileNumber"})
    }
    if(!dishes){
        res.status(400).json({error: "Order must include a dish"})
    }
    if(dishes.length === 0 || !Array.isArray(dishes)){
        res.status(400).json({error: "Order must include at least one dish"})
    }
    for (let i = 0; i < dishes.length; i++) {
        const dish = dishes[i];
        if (!dish.quantity || !Number.isInteger(dish.quantity) || dish.quantity < 1) {
            res.status(400).json({error: `Dish ${i} must have a quantity that is an integer greater than 0`});
            return;
        }
    }
    next();
}

function createOrders(req, res, next){
    const {data: { deliverTo, mobileNumber, status, dishes} = {}} = req.body;

    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes,
    }
    orders.push(newOrder)
    res.status(201).json({data: newOrder})
}

function orderIdExists(req, res, next){
    const {orderId} = req.params;
    const foundOrder = orders.find((order) => order.id === orderId)
    if(foundOrder){
        res.locals.order = foundOrder;
        return next();
    }else{
        next({
            status: 404,
            message: `Dish does not exist: ${orderId}.`
        })
    }
}

function readOrders(req, res, next){
    res.json({data: res.locals.order})
}



module.exports = {
    listOrders,
    createOrders: [validateBody ,createOrders],
    readOrders: [orderIdExists, readOrders],
}