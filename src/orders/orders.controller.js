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
            message: `Order does not exist: ${orderId}.`
        })
    }
}


function validateStatus(req, res, next){
    const {data: {id, status} = {}} = req.body;
    const {orderId} = req.params;
    if (id && id !== orderId) {
        res.status(400).json({error: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`});
    }
    const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];
    if (!status || status === "" || !validStatus.includes(status)) {
        res.status(400).json({error: "Order must have a status of pending, preparing, out-for-delivery, delivered"});
    } else if (res.locals.order.status === "delivered") {
        res.status(400).json({error: "A delivered order cannot be changed"});
    }
    next();
}

function readOrders(req, res, next){
    res.json({data: res.locals.order})
}

function updateOrders(req, res, next){
    const {data: {deliverTo, mobileNumber, dishes, status}} = req.body;

    res.locals.order = {
        id: res.locals.order.id,
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        dishes: dishes,
        status: status,
    }
    res.json({data: res.locals.order})
}

function validateDelete(req, res, next) {
	if(res.locals.order.status !== "pending") {
		return next({
			status: 400,
			message: "An order cannot be deleted unless it is pending",
		});
	}

	next();
}

function deleteOrders(req, res) {
	const idx = orders.indexOf(res.locals.order);
	orders.splice(idx, 1);

	res.sendStatus(204);
}



module.exports = {
    listOrders,
    createOrders: [validateBody ,createOrders],
    readOrders: [orderIdExists, readOrders],
    updateOrders: [validateBody, orderIdExists, validateStatus, updateOrders],
    deleteOrders: [orderIdExists, validateDelete, deleteOrders],
}