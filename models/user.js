const mongoose = require("mongoose"); //For Schema
const crypto = require("crypto"); //For Hashing Password
const uuidv1 = require("uuid/v1"); //For random unique Id

//User Schema for containing users Information
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    userinfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    //Role is the previleges, i.e if its 0, then its a user, 1 is administrator, 2 is worker, etc
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array, //If user purchases any item, the item is pushed in its array
      default: [],
    },
  },
  { timestamps: true } //When new entry comes in the schema, it records the time, date, etc
);

//Setting Hashed password in the Schema
userSchema
  .virtual("password") //Name to set in schema
  //Setting values in the userSchema
  .set(function (password) {
    //This password argument is the plain password taken from the user
    this._password = password; //Setting password to private variable _password  //This is a plain password
    this.salt = uuidv1(); //The uuid or unique id is given to each user
    this.encry_password = this.securePassword(password); //This will store the hashed password by calling the securePassword method and giving the plain password as argument
  })
  //Taking values from the userSchema
  .get(function () {
    return this._password; //Taking the password out from the schema
  });

userSchema.methods = {
  //This method is to check for authentication that when user sign in.
  //If the encryPassword or the password put by the user at that time,
  //Is it same as to the securePassword, or is it equal to the hashed value.
  //If yes, it return true, or else it returns false.
  //This will take the argument as plain password, i.e the password from the user
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  //Declaring a method or a function which will take plain password from schema and function
  //it out to a secured or hashed password.
  //This method or function returns either error or the hashed value
  //NOTE: Use simple function instead of arrow function
  securePassword: function (plainpassword) {
    if (!plainpassword) return ""; //If password is empty, then return empty string and as the schema has requiredd section as true, it will give the error.
    try {
      //This will return the hashed value by updating the plainpassword to hashed one
      //and store the value of hashed in salt
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return ""; //Again, if error is there, simply return empty so that the schema encryPass will give error
    }
  },
};

//Exporting data of user schema outside ths file.
//User is the type of class which we will use in other file to acces the data of user schema
module.exports = mongoose.model("User", userSchema);

//We create a virtual field for creating a field or object which user doesn't needs to put it.
//E.g: User doesn't need to put password in hased type or encrypted.
//Hence, we take plain text password from user and ecrypt by ourself and then we create a
//virtual field in userSchema for encrypted password.
