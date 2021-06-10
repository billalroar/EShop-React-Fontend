import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import Order from "./components/Order/Order";
import SignIn from "./components/Signin/SignIn";
import Signup from "./components/Signup/Signup";
import Cart from "./components/Cart/Cart";
import { Userprovider } from "./components/UserContext/ProductContext";
function App() {
  
  return (
    <div className="App">
      <Userprovider>
        <Router>
          <Nav />
          <Switch>
            <Route path="/cart/">
              <Cart />
            </Route>
            <Route path="/signup/">
              <Signup />
            </Route>
            <Route path="/signin/">
              <SignIn />
            </Route>
            <Route path="/order/">
              <Order />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </Userprovider>
    </div>
  );
}

export default App;
