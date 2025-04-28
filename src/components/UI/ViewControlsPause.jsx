import React from "react";
import "./../../styles/global.css";
import { useNavigate } from "react-router-dom";
import wasdImage from "./../../assets/images/wasd.png"; // Imagen que contiene WASD
import arrowsImage from "./../../assets/images/arrows.png"; // Imagen que contiene las flechas
import spacebarImage from "./../../assets/images/spacebar.png"; // Imagen de la barra espaciadora
import shiftImage from "./../../assets/images/shift.png"; // Imagen de la tecla Ctrl
import leftClickImage from "./../../assets/images/leftClick.png"; // Imagen de click izquierdo del mouse
import fImage from "./../../assets/images/fImage.png"; // Imagen de la tecla F
import AmbientMusic from "./AmbientMusic";

const Config = ({ onBack, className }) => {
  return (
    <div className={`config-menu-body ${className}`}>
      <div className="controls-container">
        <div className="control-item">
          <img src={wasdImage} alt="WASD keys" className="control-image" />
          <img src={arrowsImage} alt="Arrow keys" className="control-image" />
          <p>Teclas WASD o Flechas: Moverse libremente</p>
        </div>

        <div className="control-item">
          <img src={spacebarImage} alt="Spacebar" className="control-image" />
          <p>Barra espaciadora: Saltar</p>
        </div>

        <div className="control-item">
          <img src={shiftImage} alt="Ctrl key" className="control-image" />
          <p>Shift Izquierdo: Correr</p>
        </div>

        <div className="control-item">
          <img
            src={leftClickImage}
            alt="Left click"
            className="control-image"
          />
          <p>Click Izquierdo: Atacar</p>
        </div>

        <div className="control-item">
          <img src={fImage} alt="F key" className="control-image" />
          <p>Tecla F: Interactuar</p>
        </div>
      </div>
      <div className="menus-form">
        <button className="menus-button" onClick={onBack}>
          Regresar 
        </button>
      </div>
    </div>
  );
};

export default Config;
