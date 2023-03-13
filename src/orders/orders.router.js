const router = require("express").Router();
const ordersController = require("./orders.controller")
// TODO: Implement the /orders routes needed to make the tests pass
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/").get(ordersController.listOrders)

module.exports = router;
