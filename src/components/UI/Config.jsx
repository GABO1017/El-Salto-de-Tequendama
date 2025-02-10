import React from "react";

const Config = ({ onBack, className  }) => {
  return (
    <div className={`config-menu-body ${className}`}>
      <h2 className="config-text">Configuración de Gráficos</h2>
      <div className="menus-form">
        <button className="menus-button">Bajos</button>
        <button className="menus-button">Medios</button>
        <button className="menus-button">Altos</button>
        <button className="menus-button" onClick={onBack}>
          Regresar
        </button>
      </div>
    </div>
  );
};

export default Config;
