import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { Container, Row, Col, Tab, ListGroup } from "react-bootstrap";
import { ProductContext } from "../UserContext/ProductContext";
import ReactPaginate from "react-paginate";
import axios from "axios";
const Home = () => {
  const {value, valueCart, valuePath } = useContext(ProductContext);
  const [product, setProduct] = value;
  const [path, setPath] = valuePath;
  const [category, setCategory] = useState([]);
  const [Cart, setCart] = valueCart;

  const [pageNumber, setPageNumber] = useState(0);
  const productsPerPage = 10;
  const pagesVisited = pageNumber * productsPerPage;

  useEffect(() => {
    if(Object.keys(path).length !== 0){
      console.log(path)
      let c = "/"
      let p = path["currentPath"]
      let pa = {'privousPath':p,'currentPath':c}
      setPath(pa)
    }
    else{
      console.log(path)
      let c = "/"
      let p = "/"
      let pa = {'privousPath':p,'currentPath':c}
      setPath(pa)
    }
    if (sessionStorage.getItem("Cart") != null) {
      setCart(Object.keys(JSON.parse(sessionStorage.getItem("Cart"))).length);
    } else {
      setCart(0);
    }
    axios.get(`http://192.168.0.108:8000/category/`).then((res) => {
      const data = res.data;
      setCategory(data);
      console.log(category)
    });

    axios.get(`http://192.168.0.108:8000/products/`).then((res) => {
      const data = res.data;
      setProduct(data);
    });
  }, []);

  const getProduct = (e,p) => {
    // alert(`selected ${e}`);
    // const a = {'billal':{'lastname':'hossain','middlename':'biplob'}}
    // a['hridoy'] ={'lastname':'khan','middlename':'shanto'}
    // a.hridoy.middlename = 'hjyjryrtokh'
    // console.log(typeof(e))
    // b[e].quantity=2
    // const id = e.toString()
    if (sessionStorage.getItem("Cart") != null) {
      const b = JSON.parse(sessionStorage.getItem("Cart"));
      if (b[e] != null) {
        // console.log(b[e].quantity);
        b[e].quantity = b[e].quantity + 1;
        b[e].price=b[e].price+p;
        sessionStorage.setItem("Cart", JSON.stringify(b));
      } else {
        b[e] = { quantity: 1 ,price:p };
        sessionStorage.setItem("Cart", JSON.stringify(b));
      }
      setCart(Object.keys(JSON.parse(sessionStorage.getItem("Cart"))).length);
    } else {
      const b = {};
      b[e] = { quantity: 1,price:p };
      sessionStorage.setItem("Cart", JSON.stringify(b));
      setCart(Object.keys(JSON.parse(sessionStorage.getItem("Cart"))).length);
    }
  };

  const displayProducts = product
    .slice(pagesVisited, pagesVisited + productsPerPage)
    .map((product) => {
      return (
        <div className="card" key={`${Math.random()}`}>
          <div className="align-middle text-center">
            <h4 className="card__title">{product.name}</h4>
          </div>
          <div>
            <img
              src={product.image}
              className="card__image"
              alt={product.image}
            />
          </div>
          <div className="cart__footer">
            <h5>TK {product.price}</h5>
            <button
              className="card__btn"
              onClick={() => {
                getProduct(product.id,product.price);
              }}
            >
              Add Cart
            </button>
          </div>
        </div>
      );
    });

  const DisplayCategory = category.map((category) => {
    return (
      <ListGroup.Item key={`${Math.random()}`} eventKey={category.name}>
        {category.name}
      </ListGroup.Item>
    );
  });

  const pageCount = Math.ceil(product.length / productsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleSelect = (eventKey) => {
    // alert(`selected ${eventKey}`);
    axios
      .get(`http://192.168.0.108:8000/products/?categoryName=${eventKey}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);
      });
  };

  return (
    <div>
      <Container fluid className="mt-5">
        <Row>
          <Col md={2}>
            <div className="flex-column">
              <Tab.Container
                id="list-group-tabs-example"
                defaultActiveKey="all product"
                onSelect={handleSelect}
              >
                <Row>
                  <Col lm={10}>
                    <ListGroup className="list__nav">
                      <ListGroup.Item eventKey="all product">
                        All product
                      </ListGroup.Item>
                      {DisplayCategory}
                    </ListGroup>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </Col>
          <Col>
            <div className="wrapper">{displayProducts}</div>
            <div className="wrapper">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
