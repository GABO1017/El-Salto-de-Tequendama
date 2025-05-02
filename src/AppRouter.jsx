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
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/olvide-mi-contrasena" element={<ForgetPassword />} />

        {/* Rutas protegidas */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/controles"
          element={
            <ProtectedRoute>
              <ViewControls />
            </ProtectedRoute>
          }
        />
        <Route
          path="/juego"
          element={
            <ProtectedRoute>
              <GameWorld />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seleccion-personaje"
          element={
            <ProtectedRoute>
              <CharacterSelection />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
