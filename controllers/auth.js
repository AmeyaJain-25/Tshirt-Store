const User = require("../models/user.js"); //Getting the UserSchema
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); //This creates token
const expressJwt = require("express-jwt"); //This validates token and put it in the cookies.  //Also gives authentication.

//---------------------
//SIGN UP
exports.signup = (req, res) => {
  const errors = validationResult(req); //ValidationsResult gives errors or results from req body
  //This error is an array of errors

  //if error is not empty, i.e there is an error, then show error and return there only
  if (!errors.isEmpty()) {
    return res.status(422).json({
      //return the status code of 422(error in DB)
      //The status code returns the json object error message.
      //The message is coming from the inbuilt validationResult errors.
      //The errors has an array of { error: [{location: body, msg: invalid, param: email}]}
      //So, we use that method of getting the first membor of array as error[0] and then the msg object
      error: errors.array()[0].msg,
    });
  }

  //Creating object named user from class User i.e userSchema and we can save the information.
  //The req.body in the object user is the json data stored in it
  const user = new User(req.body);
  //Saving Data of the object user
  //The callback in saving the object has two args of one is error and other is not an error or simply the data or positive value
  user.save((err, user) => {
    if (err) {
      //If its an error, then return error of 400 status code i.e BAD REQUEST or not correct request
      return res.status(400).json({ err: "Not able to save the user in DB" });
    }
    //If its not an error, then send a response of json type of user info
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

//---------------------
//SIGN IN
exports.signin = (req, res) => {
  const { email, password } = req.body; //Getting name, email, password,etc from post request object body

  const errors = validationResult(req); //ValidationsResult gives errors or results from req body
  //This error is an array of errors

  //if error is not empty, i.e there is an error, then show error and return there only
  if (!errors.isEmpty()) {
    return res.status(422).json({
      //return the status code of 422(error in DB)
      //The status code returns the json object error message.
      //The message is coming from the inbuilt validationResult errors.
      //The errors has an array of { error: [{location: body, msg: invalid, param: email}]}
      //So, we use that method of getting the first membor of array as error[0] and then the msg object.
      error: errors.array()[0].msg,
    });
  }

  //FindOne from the database of userSchema.
  //It will pass args of what to find and a callback function of its result.
  //If the email is found, it will provide the data of it in 'user', OR ELSE it will provide the error.
  User.findOne({ email }, (err, user) => {
    //If its an error, Dont return, simply give error of email doesn't exist.
    //If user puts some email such as ameya.com, which is error, it will show error.
    //If user puts ab2abc.com, but its not registered, then we use if user is null or user is not there, then give error.
    if (err || !user) {
      return res.status(400).json({
        error: "USER Email Doesn't Exist",
      });
    }
    //If no error, then check authenticate function from UserSchema got here in user variable.
    //authenticate function returns true if its password matches, else it returns falss.
    //So, if its not true, then return the error of NO MATCH and end the method.
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password Doesn't match",
      });
    }

    //Creating a token.
    //It takes arg of key value pair of from what to create token.
    //We are creating token from the _id, coming from user variable.
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //Put the token in the cookies.
    //Set the token and give an expiry date for the token
    res.cookie("token", token, { expire: new Date() + 9999 });

    //Return the data to the front end.
    //Only return id, name, email and password to frontend. NOT THE PASSWORD.
    //Hence, destructure it.
    const { _id, name, email, role } = user;
    res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

//---------------------
//SIGN OUT
exports.signout = (req, res) => {
  //Clear cookies when sign out.
  res.clearCookie("token");
  //res,json sends the JSON data
  res.json({
    message: "USER SIGNOUT SUCCESFULLY",
  });
};

//----------------------
//PROTECTED ROUTES

//Authentication for Sign In
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//----------------------
//CUSTOM MIDDLEWARE

exports.isAuthenticated = (req, res, next) => {
  //checker is a boolean value for checking if user is authenticated or is he able to change his own profile or setting, etc.
  //If signedIn user is having a profile(From frontend), having an auth(from isSignedIn),
  //and is user having same id in the frontend or profile as to the auth in isSignedIn.
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  //If checker is false or he is not able to change his settings, then give an error.
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  //Check from profile from frontend for role.
  //If its 0, then it is a user and not admin.
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "You aren't ADMIN. Access Denied",
    });
  }
  next();
};
