import React, { useEffect, useState } from "react";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import StripeCheckout from "./StripeCheckout";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = () => {
    return (
      <div>
        <h2>Products in Cart: </h2>
        {products.map((product, index) => {
          return (
            <Card
              key={index}
              product={product}
              removeFromCart={true}
              addToCart={false}
              setReload={setReload}
              reload={reload}
            />
          );
        })}
      </div>
    );
  };

  const loadCheckout = () => {
    return <StripeCheckout products={products} setReload={setReload} />;
  };

  return (
    <Base title="Cart Page" description="Ready to Buy?">
      <div className="row text-center">
        <div className="col-4">{loadAllProducts()}</div>
        <div className="col-4">{loadCheckout()}</div>
      </div>
    </Base>
  );
};

export default Cart;
