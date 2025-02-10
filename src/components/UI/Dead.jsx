import React from "react";

const Dead = ({ onContinue, onMainMenu }) => {
  return (
    <div className="dead-menu-body">
      <div className="menus-form">
        <div className="dead-message">
          ¡HAS MUERTO!
        </div>
        <button className="menus-button" onClick={onContinue}>
          Continuar desde tu último guardado
        </button>
        <button className="menus-button" onClick={onMainMenu}>
          Regresar al menú principal
        </button>
      </div>
    </div>
  );
};

export default Dead;
