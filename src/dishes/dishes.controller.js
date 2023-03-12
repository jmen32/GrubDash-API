const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
// const orders = require("../data/orders-data")
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res, next){
  const { dishId } = req.params;
  res.json({data: dishes.filter(dishId ? dishes => dishes.id === dishId : () => true)
})}

function hasBodyProperties(req, res, next){
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

// function read(req, res, next){
//     const {dishes} = req.params;
//     const newDish = {
//         id: 
//     }
// }


module.exports = {
    list,
}