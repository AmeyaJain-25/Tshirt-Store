import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper/index";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false, //After signin, whether user is redirected to dashboard or somewhere.
  });

  //Destructuring values from useState.
  const { email, password, error, loading, didRedirect } = values;

  const { user } = isAuthenticated();

  //isAuthenticated returns the Json value of token.

  //Handling the changes in each field.
  //get event of name.
  const handleChange = (name) => (event) => {
    //On change of particular event, get the name from it's parameter.
    //Now, set the values with ... getting the initial values.
    //Then set error to false and "name" as key and it's targetted value as it's value.
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  //On Submitting the form.
  const onsubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            setValues({ ...values, didRedirect: true, email: "", error: "" });
          });
        }
      })
      .catch(console.log("Sign In Failed"));
  };

  //Perform Redirect
  const performRedirect = () => {
    if (didRedirect) {
      //If redirect is true, then if user is admin, then redirect the admin.
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    //If user is not an admin, but tries to signin with clicking on admin dashboard, then check if authenticated.
    //If user is authenticated, then redirect user to homePage.
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  //LOADING Message
  const loadingMessage = () => {
    //Div for showing if account created successfully.
    //Make an Alert message.

    //If loading is true, then the other part is always true.
    //Hence, if loading is true, it will return the loading HTML part.
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading......!</h2>
        </div>
      )
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

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
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
                onChange={handleChange("password")}
                value={password}
              />
            </div>
            <button className="btn btn-success btn-block" onClick={onsubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="SignIn Page" description="SignIn For Users">
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
      {/* <p className="text-white text-center">{JSON.stringify(values)}</p> */}
    </Base>
  );
};

export default Signin;
