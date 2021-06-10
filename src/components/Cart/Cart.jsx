import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Row, Col, Card, ListGroup } from "react-bootstrap";
import "./Cart.css";
import { ProductContext } from "../UserContext/ProductContext";
import { BsPlus, BsDash } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Cart = () => {
  const { value, valueCart, valuePath } = useContext(ProductContext);
  const [Cart, setCart] = valueCart;
  const [path, setPath] = valuePath;
  const [Cartproduct, setCartproduct] = useState([]);
  const [session, setSession] = useState([]);
  const [carttotal, setCarttotal] = useState(0);
  const [totalprice, setTotalprice] = useState();
  const history = useHistory();

  useEffect(() => {
    if (Object.keys(path).length !== 0) {
      let c = "/cart/";
      let p = path["currentPath"];
      let pa = { privousPath: p, currentPath: c };
      setPath(pa);
    } else {
      let c = "/cart/";
      let p = "/cart/";
      let pa = { privousPath: p, currentPath: c };
      setPath(pa);
    }
    if (sessionStorage.getItem("Cart") != null) {
      setCart(Object.keys(JSON.parse(sessionStorage.getItem("Cart"))).length);
    } else {
      setCart(0);
    }
    getValues();
  }, []);

  const orderCart = () => {
    if (sessionStorage.getItem("Cart") != null) {
      if (sessionStorage.getItem("Login") != null) {
        let v={} 
        v['cart']= JSON.parse(sessionStorage.getItem("Cart"));
        v['user_id']=JSON.parse(sessionStorage.getItem("Login"))
        axios.post(`http://192.168.0.108:8000/order/`, v).then((res) => {
          const data = res.data;
          if (data["error"] != true) {
            alert(data["message"]);
            sessionStorage.removeItem("Cart");
            history.push("/");
          }
          else{
            alert(data["message"]);
          }
        });
      } else {
        history.push("/signin/");
      }
    } else {
      alert(`Cart Not Found !!`);
    }
  };

  const getValues = () => {
    if (sessionStorage.getItem("Cart") != null) {
      getPrice();
      let v = Object.keys(JSON.parse(sessionStorage.getItem("Cart")));
      axios
        .get(`http://192.168.0.108:8000/productbyId/?productid=${v}`)
        .then((res) => {
          const data = res.data;
          setCartproduct(data);
        });
    } else {
      setCartproduct([]);
    }
    if (sessionStorage.getItem("Cart") != null) {
      setCart(Object.keys(JSON.parse(sessionStorage.getItem("Cart"))).length);
    } else {
      setCart(0);
    }
    setSession(JSON.parse(sessionStorage.getItem("Cart")));
  };

  const productdelete = (id, i) => {
    let s = JSON.parse(sessionStorage.getItem("Cart"));
    delete s[id];
    sessionStorage.setItem("Cart", JSON.stringify(s));
    setSession(JSON.parse(sessionStorage.getItem("Cart")));
    delete Cartproduct[i];
    setCartproduct(Cartproduct);
    if (sessionStorage.getItem("Cart") != null) {
      setCart(Object.keys(JSON.parse(sessionStorage.getItem("Cart"))).length);
    } else {
      setCart(0);
    }
    getPrice();
  };

  const getPrice = () => {
    if (sessionStorage.getItem("Cart") != null) {
      let v = Object.keys(JSON.parse(sessionStorage.getItem("Cart")));
      let p = JSON.parse(sessionStorage.getItem("Cart"));
      let price = 0;
      for (let i = 0; i < v.length; i++) {
        price = price + p[v[i]].price;
      }
      setCarttotal(price);
      setTotalprice(price + (price / 100) * 15);
    }
  };

  const quantityincre = (p, id) => {
    let s = session;
    s[id].quantity = s[id].quantity + 1;
    s[id].price = s[id].price + p;
    sessionStorage.setItem("Cart", JSON.stringify(s));
    setSession(JSON.parse(sessionStorage.getItem("Cart")));
    getPrice();
  };
  const quantitydicre = (p, id) => {
    let s = session;
    if (s[id].quantity > 1) {
      s[id].quantity = s[id].quantity - 1;
      s[id].price = s[id].price - p;
    }
    sessionStorage.setItem("Cart", JSON.stringify(s));
    setSession(JSON.parse(sessionStorage.getItem("Cart")));
    getPrice();
  };

  let i = +1;
  const DisplayCart = Cartproduct.map(function (C, index) {
    return (
      <tr key={`${Math.random()}`}>
        <td className="align-middle text-center">{i++}</td>
        <td className="align-middle text-center">
          <img src={C.image} className="cart__image" alt={C.image} />
        </td>
        <td className="align-middle text-center">{C.name}</td>
        <td className="align-middle text-center">{C.price}</td>
        <td className="align-middle text-center " variant="primary">
          <Row className="justify-content-md-center">
            <Col md="auto">
              <Button
                className="align-middle text-center"
                variant="danger"
                size="sm"
                onClick={() => {
                  quantitydicre(C.price, C.id);
                }}
              >
                <BsDash className="align-middle text-center " size="1.5em" />
              </Button>
            </Col>

            <Col md="auto" className="align-middle text-center">
              <h4 className="align-middle text-center ">
                {session[C.id].quantity}
              </h4>
            </Col>
            <Col md="auto" size=".5em">
              <Button
                className="align-middle text-center"
                variant="primary"
                size="sm"
                onClick={() => {
                  quantityincre(C.price, C.id);
                }}
              >
                <BsPlus className="align-middle text-center " size="1.5em" />
              </Button>
            </Col>
          </Row>
        </td>
        <td className="align-middle text-center">
          <Button
            className="align-middle text-center"
            variant="warning"
            size="sm"
            onClick={() => {
              productdelete(C.id, index);
            }}
          >
            <MdDeleteForever
              className="align-middle text-center "
              size="1.5em"
            />
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Row>
        <Col xs={9}>
          <div className=" Card__">
            <div>
              <h2>Cart Table</h2>
            </div>
            <div>
              <Table hover bordered className="table__">
                <thead className="text-center">
                  <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>{DisplayCart}</tbody>
              </Table>
            </div>
          </div>
        </Col>
        <Col xs={3}>
          <div>
            <div className="order_total">
              <Card>
                <Card.Header className="align-middle text-center ">
                  <h3>Cart Details</h3>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col xs={8}>
                          <Card.Title>Card Total</Card.Title>
                        </Col>
                        <Col xs={4}>
                          <Card.Text className="align-middle text-center ">
                            {carttotal}
                          </Card.Text>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col xs={8}>
                          <Card.Title>Vat</Card.Title>
                        </Col>
                        <Col xs={4}>
                          <Card.Text className="align-middle text-center ">
                            15 %
                          </Card.Text>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col xs={8}>
                          <Card.Title>
                            <h6>Total Price</h6>
                          </Card.Title>
                        </Col>
                        <Col xs={4}>
                          <Card.Text className="align-middle text-center ">
                            {totalprice}
                          </Card.Text>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                  <Button
                    onClick={() => {
                      orderCart();
                    }}
                    variant="primary"
                    size="lg"
                    block
                  >
                    Order
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
