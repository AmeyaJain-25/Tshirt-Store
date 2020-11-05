import { API } from "../../backend";

//SIGNUP
export const signup = (user) => {
  //API call
  //Fetch Request
  return (
    fetch(`${API}/signup`, {
      method: "POST", //Post request.
      //Same as header in PostMan.
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //What to pass on in request.
      //Pass the data of user in Json format.
      body: JSON.stringify(user),
    })
      //If successfully made a request, then send a response to the frontend.
      .then((response) => {
        return response.json();
      })
      //If there occured an error, then console it in log.
      .catch((err) => {
        console.log(err);
      })
  );
};

//SIGNIN
export const signin = (user) => {
  //API call
  //Fetch Request
  return (
    fetch(`${API}/signin`, {
      method: "POST", //Post request.
      //Same as header in PostMan.
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //What to pass on in request.
      //Pass the data of user in Json format.
      body: JSON.stringify(user),
    })
      //If successfully made a request, then send a response to the frontend.
      .then((response) => {
        return response.json();
      })
      //If there occured an error, then console it in log.
      .catch((err) => {
        console.log(err);
      })
  );
};

//Authenticate
//Sending tokens to browser.
//next means middleware
export const authenticate = (data, next) => {
  //If the window is having something, i.e no undefined, then set the data or the token to local storage.
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

//SIGNOUT
//next means middleware
export const signout = (next) => {
  if (typeof window !== "undefined") {
    //remove the itemcalled jwt which is having tokens in it.
    localStorage.removeItem("jwt");
    next();

    //If removed token, then make an API call.
    return fetch(`${API}/signout`, {
      method: "GET",
    })
      .then((response) => {
        console.log("SIGNOUT SUCCESSFULLYYYYY!!!!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//Checking if user is signed in or not.
//If authenticated, it provides the user data.
export const isAuthenticated = () => {
  //If there is no object in window, then say false that user is not signed in.
  if (typeof window == "undefined") {
    return false;
  }
  //If there is an jwt token in local storage, then return the token value from local storage.
  //In frontend, this token value will be checked with DB and let him keep signed in.
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
