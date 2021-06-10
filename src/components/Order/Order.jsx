import React, { useContext, useEffect, useState } from "react";
import { Table, Badge, Row, Col, Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ProductContext } from "../UserContext/ProductContext";

const Order = () => {

  const [Orderproduct, setorderproduct] = useState([]);

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("Login")) != null) {
      let v = JSON.parse(sessionStorage.getItem("Login"))['id'];
      console.log(v);
      axios.get(`http://192.168.0.108:8000/order/?id=${v}`).then((res) => {
        const data = res.data;
        if (data["error"] != true) {
            console.log(data['result'])
            setorderproduct(data['result'])
        } else {
          alert(data["message"]);
        }
      });
    }
  }, []);

  let i = +1;
  const Displayorder = Orderproduct.map(function (O, index) {
    return (
      <tr key={`${Math.random()}`}>
        <td className="align-middle text-center">{i++}</td>
        <td className="align-middle text-center">
          <img src={O["product"].image} className="cart__image" alt={O["product"].image} />
        </td>
        <td className="align-middle text-center">{O["product"].name}</td>
        <td className="align-middle text-center">{O.price}</td>
        <td className="align-middle text-center">{O.quantity}</td>
        <td className="align-middle text-center"> {O.date}</td>
        <td className="align-middle text-center">{O.status ? <Badge variant="success">Success</Badge> :<Badge variant="warning">Panding</Badge>}</td>
      </tr>
    );
  });

  return (
    <div>
      <div>
        <Row>
          <Col xs={12}>
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
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>{Displayorder}</tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Order;
