// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./scenes/Login/Login";
import Register from "./scenes/Login/Register";
import ForgetPassword from "./scenes/Login/ForgetPassword";
import MainMenu from "./scenes/MainMenu/MainMenu";
import ViewControls from "./components/UI/ViewControls";
import GameWorld from "./scenes/GameWorld/GameWorld";
import CharacterSelection from "./components/UI/CharacterSelection";


function AppRouter() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/olvide-mi-contrasena" element={<ForgetPassword />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/controles" element={<ViewControls />} />
        <Route path="/juego" element={<GameWorld />} />
        <Route path="/seleccion-personaje" element={<CharacterSelection />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
