import React from "react";
 
const Win = ({ onContinue, onMainMenu }) => {
  return (
    <div className="dead-menu-body">
      <div className="menus-form">
        <div className="dead-message">
          ¡GANASTE, HAS REGRESADO LA PAZ A LA ALDEA!
        </div>
        <button className="menus-button" onClick={onContinue}>
          Continua explorando
        </button>
        <button className="menus-button" onClick={onMainMenu}>
          Regresar al menú principal
        </button>
      </div>
    </div>
  );
};
 
export default Win;