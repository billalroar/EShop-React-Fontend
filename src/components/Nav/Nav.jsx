import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Nav.css";
import { ProductContext } from "../UserContext/ProductContext";

const Nava = () => {
  const { value, valueCart, valuePath } = useContext(ProductContext);
  const [Cart, setCart] = valueCart;

  const renderItem = () => {
    console.log(JSON.parse(sessionStorage.getItem("Login")));
    if (JSON.parse(sessionStorage.getItem("Login")) != null) {
      return (
        <NavDropdown title="User Account" id="collasible-nav-dropdown">
          <NavDropdown.Item as={Link} to="/order">
            Order
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/logout/">
            LogOut
          </NavDropdown.Item>
        </NavDropdown>
      );
    } else {
      console.log("third");
      return (
        <NavDropdown title="User Account" id="collasible-nav-dropdown">
          <NavDropdown.Item as={Link} to="/signin/">
            SignIn
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/signup/">
            signUp
          </NavDropdown.Item>
        </NavDropdown>
      );
    }
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand as={Link} to="/">
          E-Shop
        </Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
          </Nav>
          <Nav>
            {renderItem()}
            <Nav.Link as={Link} to="/cart/">
              <li className="cart__nav">
                Cart (<span className="cart__count">{Cart}</span>)
              </li>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Nava;
