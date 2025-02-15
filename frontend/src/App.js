import React from "react";
import AppRoutes from "./Routes";
import ScrollToTop from "./User/Global/Scroll";
import "./App.css"; 

const App = () => {
  return (
    <>
      <AppRoutes />
      <ScrollToTop />
    </>
  );
};

export default App;
