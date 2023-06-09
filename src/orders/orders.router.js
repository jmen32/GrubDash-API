const router = require("express").Router();
const ordersController = require("./orders.controller")
// TODO: Implement the /orders routes needed to make the tests pass
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/:orderId").get(ordersController.readOrders).put(ordersController.updateOrders).delete(ordersController.deleteOrders).all(methodNotAllowed)

router.route("/").get(ordersController.listOrders).post(ordersController.createOrders).all(methodNotAllowed)

module.exports = router;
