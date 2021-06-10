import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../UserContext/ProductContext";
import { Col, Button, Form } from "react-bootstrap";
import "./Signup.css";
import axios from "axios";
import { useHistory } from "react-router-dom";


const Signup = () => {
  const [validated, setValidated] = useState(false);
  const [showResults, setShowResults] = useState("");
  const [errorResults, setErrorResults] = useState(false);
  const [showEmail, setShowEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [showPhone, setShowPhone] = useState("");
  const [errorPhone, setErrorPhone] = useState(false);
  const [showmessage, setShowMessage] = useState("");
  const [servererror, setServererror] = useState(false);
  const { value, valueCart,valuePath } = useContext(ProductContext);
  const [Cart, setCart] = valueCart;
  const [path, setPath] = valuePath;
  const history = useHistory();

  useEffect(() => {
    if(Object.keys(path).length !== 0){
      let c = "/signup/"
      let p = path["currentPath"]
      let pa = {'privousPath':p,'currentPath':c}
      setPath(pa)
    }
    else{
      let c = "/signup/"
      let p = "/signup/"
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
      event.stopPropagation();
      event.preventDefault();
      setErrorEmail(false);
      setShowEmail("");
      setErrorResults(false);
      setShowResults("");
      setErrorPhone(false);
      setShowPhone("");
      setShowMessage("");
      setServererror(false);
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
        event.target.elements.confirm_password.value.length > 6
      ) {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
        setErrorResults(true);
        setShowResults("Your password must be 6-20 characters long !!");
      } else if (
        event.target.elements.password.value !==
        event.target.elements.confirm_password.value
      ) {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
        setErrorResults(true);
        setShowResults("Password Not Match !!");
      } else {
        setErrorResults(false);
        setShowResults("");
      }

      if (isNaN(event.target.elements.phone.value)) {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
        setErrorPhone(true);
        setShowPhone("Phone Number Not Valid !!");
      } else if (event.target.elements.phone.value.length < 11) {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
        setErrorPhone(true);
        setShowPhone("Phone Number Not Valid !!");
      } else {
        setErrorPhone(false);
        setShowPhone("");
      }

      if (errorResults != true && errorEmail != true && errorPhone != true) {
        event.stopPropagation(); //#stop uerwrite click
        event.preventDefault(); //#reload stop
        const data = {};
        data["first_name"] = event.target.elements.First_name.value;
        data["last_name"] = event.target.elements.Last_name.value;
        data["email"] = event.target.elements.email.value;
        data["phone"] = event.target.elements.phone.value;
        data["password"] = event.target.elements.password.value;
        data["address"] = event.target.elements.address.value;
        data["city"] = event.target.elements.city.value;
        data["state"] = event.target.elements.state.value;
        data["zip"] = event.target.elements.zip.value;
        axios.post(`http://192.168.0.108:8000/customer/`, data).then((res) => {
          const data = res.data;
          if (data["error"]) {
            setShowMessage(data["message"]);
            setServererror(true);
            console.log(data["error"]);
            console.log(data["error"], data["message"]);
          } else {
            setShowMessage("");
            setServererror(false);
            console.log(data["error"]);
            console.log(data["error"], data["message"]);
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
          <h2>Create user</h2>
        </div>
        <div>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="First_name">
                <Form.Label>First name</Form.Label>
                <Form.Control required type="text" placeholder="First name" />
                <Form.Control.Feedback type="invalid">
                  First name requried
                </Form.Control.Feedback>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="Last_name">
                <Form.Label>Last name</Form.Label>
                <Form.Control required type="text" placeholder="Last name" />
                <Form.Control.Feedback type="invalid">
                  Last name requried
                </Form.Control.Feedback>
                <Form.Control.Feedback v>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
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
              <Form.Group as={Col} md="12" controlId="phone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="Phone Number" required />
                {errorPhone ? (
                  <h6 className="error__sms">{showPhone}</h6>
                ) : (
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  aria-describedby="passwordHelpInline"
                  type="password"
                  placeholder="Password"
                  required
                />
                {errorResults ? (
                  <h6 className="error__sms">{showResults}</h6>
                ) : (
                  <Form.Text className="text-muted">
                    We'll never share your Password with anyone else.
                  </Form.Text>
                )}

                <Form.Control.Feedback type="invalid">
                  Please provide Password
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="confirm_password">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  required
                />
                {errorResults ? (
                  <h6 className="error__sms">{showPhone}</h6>
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

            <Form.Row>
              <Form.Group as={Col} md="12" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control type="test" placeholder="Address" required />
                <Form.Control.Feedback type="invalid">
                  Please provide Your address
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="City" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid city.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" placeholder="State" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid state.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="zip">
                <Form.Label>Zip</Form.Label>
                <Form.Control type="text" placeholder="Zip" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid zip.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Group>
              <Form.Check
                required
                label="Agree to terms and conditions"
                feedback="You must agree before submitting."
              />
            </Form.Group>
            <Button type="submit">Create user</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
