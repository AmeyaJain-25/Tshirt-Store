const User = require("../models/user.js"); //Importing User from User Schema
const Order = require("../models/order.js");

//Get the user by it's Id. //This id coming from url will be taken and find the user from DB.
//This is param used, hence id is coming after next.
exports.getUserById = (req, res, next, id) => {
  //Find the user from DB by Id and then execute further.
  //The two parameters are error or user object.
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No User Found in DB",
      });
    }
    //Set the data of the user in Profile for frontend.
    req.profile = user;
    //This profile is showing in getUser. And this is showing full object of user, i.e the passwords too. Hence make it umdefined.
    //These are undefined only in the profile and not in DB.
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    //It's an custom middleware, hence next is required.
    next();
  });
};
//Above Function gets the Id from frontend and finds in database and fills the data of user in profile.

//Now, we will get the user data from
exports.getUser = (req, res) => {
  //Get data from profile.
  return res.json(req.profile);
};

//Updating User
exports.updateUser = (req, res) => {
  //Find the user by it's Id and update.
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body }, //Where to set.
    { new: true, useFindAndModify: false }, //"new = true" means update is going on.
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "Not Authorized to update" });
      }
      //Removing the salt and encrypted password.
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

//Get the data of Purchase list of User. This we are getting from Order Schema.
exports.userPurchaseList = (req, res) => {
  //We will find user by using id and use populate to find the order.
  //As order schema is having User details and the user details over there is coming as ref. Hence we use populate.
  //We will populate the user's name and id from order schema.
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this Account",
        });
      }
      return res.json(order);
    });
};

//This is an middleware.
//Updating the purchase list of the user when he buys something.
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //Storing in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchase) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save Purchase List",
        });
      }
      next();
    }
  );
};
