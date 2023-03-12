const router = require("express").Router();
const dishController = require("./dishes.controller")
// TODO: Implement the /dishes routes needed to make the tests pass
router.route("/").get(dishController.list)

module.exports = router;
