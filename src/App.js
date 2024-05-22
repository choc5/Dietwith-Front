import React, { useState, useEffect } from "react";
import { Route, Routes, useFetcher } from "react-router-dom";
import SideBar from "./components/SideBar";

function App() {
  return (
    <div className="app">
      <SideBar/>
    </div>
  );
}

export default App;
