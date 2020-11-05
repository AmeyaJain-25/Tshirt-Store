import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

const Signup = () => {
  //USe State will keep the values and setValues in state.
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });
  //Destructuring Values of State.
  const { name, email, password, error, success } = values;

  //Handling the changes in each field.
  //get event of name.
  const handleChange = (name) => (event) => {
    //On change of particular event, get the name from it's parameter.
    //Now, set the values with ... getting the initial values.
    //Then set error to false and "name" as key and it's targetted value as it's value.
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  //On submitting the Form, send data to backend through API call and reset the details of useState.
  const onSubmit = (event) => {
    event.preventDefault();
    //On Submitting, set the error as false.
    setValues({ ...values, error: false });
    //API call to send the details to backend.
    //Send the name, email and password to backend.
    signup({ name, email, password })
      //If API call was success, then reset the useState.
      .then((data) => {
        //If it's an error, then set the error as the frontend as error and success as false.
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          //Else, reset all the useState as the user is successfully signedIn.
          setValues({
            ...values,
            name: "",
            email: "",
            error: "",
            success: true,
          });
        }
      })
      .catch(console.log("Error in SignUp"));
  };

  //SUCCESS Message
  const successMessage = () => {
    //Div for showing if account created successfully.
    //Make an Alert message.
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            New Account Created Successfully
            {/* Link to go to signin page for singing in */}
            <Link to="/signin">Please Login Here</Link>
          </div>
        </div>
      </div>
    );
  };

  //ERROR Message
  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const signUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={handleChange("name")}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={handleChange("email")}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={handleChange("password")}
              />
            </div>
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="SignUp Page" description="SignUp For Users">
      {successMessage()}
      {errorMessage()}
      {signUpForm()}
      {/* <p className="text-white text-center">{JSON.stringify(values)}</p> */}
    </Base>
  );
};

export default Signup;
