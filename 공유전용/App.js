import React, { useState, useEffect } from "react";
import { Route, Routes, useFetcher } from "react-router-dom";
import SideBar from "./components/SideBar";

function App() {
  useEffect(() => {}, []);
  return (
    <div className="app">
      <SideBar/>
      {/* <Routes>
        <Route path="/" element={<SideBar />} />
      </Routes> */}
    </div>
  );
}

export default App;
