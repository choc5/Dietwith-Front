import React, { useState, useEffect } from "react";
import { Route, Routes, useFetcher } from "react-router-dom";
import Home from "../pages/Home"
import Ai_recomend from "../pages/Ai_recomend"
import Upload from "../pages/Upload";
import History from "../pages/History";
import Friends from "../pages/Friends";
import Login from "../pages/Login";
import Join from "../pages/Join";
import ID_PassFind from "../pages/ID_PassFind"

const Router = () => {
    useEffect(() => {}, []);
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/Join" element={<Join/>}/>
                <Route path="/ID_passFind" element={<ID_PassFind/>}/>

                <Route path="/Home" element={<Home/>} />
                <Route path="/Upload" element={<Upload/>}/>
                <Route path="/History" element={<History/>}/>
                <Route path="/Friends" element={<Friends/>}/>
                <Route path="/Ai" element={<Ai_recomend/>}/>
            </Routes>
        </div>
    )
}

export default Router;
  