const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isAdmin,
  isSignedIn,
} = require("../controllers/auth.js");
const {
  getUserById,
  pushOrderInPurchaseList,
} = require("../controllers/user.js");
const { updateStock } = require("../controllers/product.js");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require("../controllers/order.js");

//Params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Create an order.
//First check the signing and authentication of user. Then push the order or products in the purchase list.
//Then update the stock and the sold and then create an order.
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

//Getting all the orders.
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

//Status of an Order
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
