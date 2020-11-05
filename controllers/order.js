const { ProductCart, Order } = require("../models/order.js");

//Get the order by Id
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    //Populate the order by the product.
    //products is an array of products in cart. //in array of products, there are each product.
    //Also get the name and price of that each product.
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Order not Found in DB",
        });
      }
      req.order = order;
      next();
    });
};

//Create Order
exports.createOrder = (req, res) => {
  //Set the details of user in order having an user filed as reference to userschema by getting from profile.
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Order not Saved in DB",
      });
    }
    res.json(order);
  });
};

//Get All the Orders
exports.getAllOrders = (req, res) => {
  //Find the order and populate it by the user.
  //Get the id and name of that user.
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Order not found in DB",
        });
      }
      res.json(order);
    });
};

//Get the status of order.
exports.getOrderStatus = (req, res) => {
  //Get enum values from user schema.
  res.json(Order.schema.path("status").enumValues);
};

//Update the status of order.
exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Order Status not updated in DB",
        });
      }
      res.json(order);
    }
  );
};
