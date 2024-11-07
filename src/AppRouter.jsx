// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./scenes/Login/Login"
import Register from "./scenes/Login/Register";
import MainMenu from "./scenes/MainMenu/MainMenu";
import ViewControls from "./components/UI/ViewControls";



function AppRouter() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Register />} />    
                <Route path="/menu" element={<MainMenu />} />
                <Route path="/controls" element={<ViewControls />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;