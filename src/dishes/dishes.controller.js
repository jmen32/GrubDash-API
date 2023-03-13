const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
// const orders = require("../data/orders-data")
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// displays list of dishes
function list(req, res, next){
    const { dishId } = req.params;
    res.json({ data: dishes.filter((dish) => !dishId || dish.id === dishId) });
}

// Checks to see if the body of the dish contains all needed properties
function validateBody(req, res, next){
    const { data: {name, description, price, image_url} = {}} = req.body

    if (!name  || name === ""){
        res.status(400).json({error: "Dish must include a name"})
    }
    if(!description || description === ""){
        res.status(400).json({error: "Dish must include a description"})
    }
    if(!price){
        res.status(400).json({error: "Dish must include a price"})
    }
    if(price <= 0 || !Number.isInteger(price)){
        res.status(400).json({error: "Dish must have a price that is an integer greater than 0"})
    }
    if(!image_url || image_url === ""){
        res.status(400).json({error: "Dish must include a image_url"})
    }
    next();
}

// creates new dish and adds to list
function create(req, res, next){
    const { data: {name, description, price, image_url} = {}} = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    }
    dishes.push(newDish);
    res.status(201).json({data: newDish})
}

// check to see if a dish exists
function dishIdExists(req, res, next){
    const {dishId} = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if(foundDish){
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}`
    })
}

// check if dishId matches route id
function dishBodyIdExists(req, res, next){
    const { data: { id } = {} } = req.body;
    const {dishId} = req.params;
    if(!id){
        // If the ID is missing, skip the check and let the next middleware handle the error
        return next();
    }
    if(id === dishId){
        next();
    } else {
        next({
            status: 400,
            message: `Dish id does not match router Id. Dish: ${id}, Route: ${dishId}`
        });
    }
}

function read(req, res, next){
    res.json({data: res.locals.dish})
}

function update(req, res, next){
    const { data: { name, description, price, image_url } = {} } = req.body;

	const dish = res.locals.dish;
    if(dish){
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
	res.json({ data: dish});
    }else {
        next({
        status: 404,
    })
    }
}


module.exports = {
    list,
    create: [validateBody, create],
    read: [dishIdExists, read],
    update: [dishIdExists, dishBodyIdExists, validateBody, update],
}