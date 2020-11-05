import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddCategory from "./admin/AddCategory.js";
import AddProduct from "./admin/AddProduct.js";
import ManageCategories from "./admin/ManageCategories.js";
import ManageProducts from "./admin/ManageProducts.js";
import UpdateProduct from "./admin/UpdateProduct.js";
import AdminRoutes from "./auth/helper/AdminRoutes.js";
import PrivateRoutes from "./auth/helper/PrivateRoutes.js";
import Cart from "./core/Cart.js";
import Home from "./core/Home.js";
import AdminDashboard from "./user/AdminDashBoard.js";
import Signin from "./user/Signin.js";
import Signup from "./user/Signup.js";
import UserDashboard from "./user/UserDashBoard.js";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/cart" exact component={Cart} />
        <PrivateRoutes path="/user/dashboard" exact component={UserDashboard} />
        <AdminRoutes path="/admin/dashboard" exact component={AdminDashboard} />
        <AdminRoutes
          path="/admin/create/category"
          exact
          component={AddCategory}
        />
        <AdminRoutes
          path="/admin/categories"
          exact
          component={ManageCategories}
        />
        <AdminRoutes
          path="/admin/create/product"
          exact
          component={AddProduct}
        />
        <AdminRoutes path="/admin/products" exact component={ManageProducts} />
        <AdminRoutes
          path="/admin/product/update/:productId"
          exact
          component={UpdateProduct}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
