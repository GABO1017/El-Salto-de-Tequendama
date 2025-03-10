import React, { useState } from "react";
import Config from "./Config"; 

const PauseMenu = ({ onResume, onMainMenu, onSave }) => {
  const [showConfig, setShowConfig] = useState(false);

  const handleConfig = () => {
    setShowConfig(true);
  };

  const handleConfigClose = () => {
    setShowConfig(false);
  };

  return (
    <div className="pause-menu-body">
      {showConfig ? (
        <Config onBack={handleConfigClose} />
      ) : (
        <>
          <div className="top-left-text">
            <span>Tu próximo objetivo es llegar a la cima del monte sagrado</span>
          </div>
          <div className="menus-form">
            <button className="menus-button" onClick={onResume}>
              Continuar
            </button>
            <button className="menus-button" onClick={handleConfig}>
              Configuración de Graficos
            </button>
            <button className="menus-button" onClick={onSave}>
              Guardar
            </button>
            <button className="menus-button" onClick={onMainMenu}>
              Regresar al menú principal
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PauseMenu;
