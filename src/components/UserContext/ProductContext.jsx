import React, { createContext, useState } from "react";

export const ProductContext = createContext();

export const Userprovider = (props) => {
  const [product, setproduct] = useState([]);
  const [cart, setcart] = useState(0);
  const [login, setLogin] = useState(0);
  const [path, setPath] = useState({});

  return (
    <ProductContext.Provider value={{ value: [product, setproduct],valueCart: [cart, setcart],valueLogin: [login, setLogin],valuePath: [path, setPath],}}>
      {props.children}
    </ProductContext.Provider>
  );
};
