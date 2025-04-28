import React, { useState } from "react";
import ViewControlsPause from "./ViewControlsPause";

const PauseMenu = ({ onResume, onMainMenu, onSave, objective }) => {
  const [showControls, setShowControls] = useState(false);

  const handleControls = () => {
    setShowControls(true);
  };

  const handleControlsClose = () => {
    setShowControls(false);
  };

  return (
    <div className="pause-menu-body">
      {showControls ? (
        <ViewControlsPause onBack={handleControlsClose} />
      ) : (
        <>
          <div className="top-left-text">
            <span>{objective}</span>
          </div>
          <div className="menus-form">
            <button className="menus-button" onClick={onResume}>
              Continuar
            </button>
            <button className="menus-button" onClick={handleControls}>
              Controles
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
