import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";

const StripeCheckout = ({
  products,
  setReload = (v) => v,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalPrice = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <button className="btn btn-success">Pay with Stripe</button>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Sign In to Pay</button>
      </Link>
    );
  };

  return (
    <div className="text-white">
      <h2>Stripe Checkout</h2>
      <h2>Total amount: {getFinalPrice()}</h2>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
