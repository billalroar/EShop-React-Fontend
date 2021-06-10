import React, { useContext, useEffect, useState } from "react";
import { Col, Button, Form } from "react-bootstrap";
import "./Signin.css";
import axios from "axios";
import { ProductContext } from "../UserContext/ProductContext";
import { useHistory } from "react-router-dom";

const SignIn = () => {
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [showEmail, setShowEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const {value, valueCart, valuePath } = useContext(ProductContext);
  const [Cart, setCart] = valueCart;
  const [path, setPath] = valuePath;
  const history = useHistory();


  useEffect(() => {
    if(Object.keys(path).length !== 0){
      let c = "/signin/"
      let p = path["currentPath"]
      let pa = {'privousPath':p,'currentPath':c}
      setPath(pa)
    }
    else{
      let c = "/signin/"
      let p = "/signin/"
      let pa = {'privousPath':p,'currentPath':c}
      setPath(pa)
    }
    if (sessionStorage.getItem("Cart") != null) {
      setCart(Object.keys(JSON.parse(sessionStorage.getItem("Cart"))).length);
    } else {
      setCart(0);
    }
  }, []);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          event.target.elements.email.value
        ) === false
      ) {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
        setErrorEmail(true);
        setShowEmail("Email Not Valid!!");
      } else {
        setErrorEmail(false);
        setShowEmail("");
      }

      if (
        event.target.elements.password.value.length < 6 ||
        event.target.elements.password.value.length > 20
      ) {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
        setErrorPassword(true);
        setShowPassword("Your password must be 6-20 characters long !!");
      } else {
        setErrorPassword(false);
        setShowPassword("");
      }

      if (errorEmail !== true && errorPassword !== true) {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
        const data = {};
        data["email"] = event.target.elements.email.value;
        data["password"] = event.target.elements.password.value;
        axios.post(`http://192.168.0.108:8000/login/`, data).then((res) => {
          const data = res.data;
          if (data["error"]) {
            setErrorPassword(true);
            setShowPassword(data["message"]);
            console.log(data["error"]);
            console.log(data["error"], data["message"]);
          } else {
            const b = {};
            b["id"] = data["data"][0].id;
            sessionStorage.setItem("Login", JSON.stringify(b));
            // let v = JSON.parse(sessionStorage.getItem("Login"));
            // console.log(v["id"]);
            // let i = (v["id"])
            // setLogin(1);
            setErrorPassword(false);
            setShowPassword("");
            if(path["privousPath"] != path["currentPath"]){
              let p = path["privousPath"]
              history.push(p);
            }
            else{
              let p = "/"
              history.push(p);
            }
          }
        });
      } else {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
      }
    }
    setValidated(true);
  };

  return (
    <div>
      <div className="sign__up">
        <div>
          <h2>Signin user</h2>
        </div>
        <div>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" required />
                {errorEmail ? (
                  <h6 className="error__sms">{showEmail}</h6>
                ) : (
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                )}

                <Form.Control.Feedback type="invalid">
                  Please provide a valid email
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  aria-describedby="passwordHelpInline"
                  type="password"
                  placeholder="Password"
                  required
                />
                {errorPassword ? (
                  <h6 className="error__sms">{showPassword}</h6>
                ) : (
                  <Form.Text className="text-muted">
                    We'll never share your Password with anyone else.
                  </Form.Text>
                )}

                <Form.Control.Feedback type="invalid">
                  Please provide Password
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button type="submit">Create user</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
