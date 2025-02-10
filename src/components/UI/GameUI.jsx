import React from "react";
import heartFull from "/textures/hearts.svg"; // Ícono de corazón lleno
import heartEmpty from "/textures/shattered-heart.svg"; // Ícono de corazón vacío
import menuIcon from "/textures/pause-button.svg"; // Ícono del menú

const GameUI = ({ health, onPause, objective }) => {
  // Calculamos cuántos corazones mostrar
  const maxHearts = 5;
  const hearts = Array.from({ length: maxHearts }, (_, i) =>
    i < health / 10 ? heartFull : heartEmpty
  );

  return (
    <div className="game-ui">
      {/* Esquina superior izquierda: Vida y objetivo */}
      <div className="top-left">
        <div className="hearts">
          {hearts.map((heart, index) => (
            <img key={index} src={heart} alt="heart" className="heart-icon" />
          ))}
        </div>
        <p className="objective-text">{objective}</p>
      </div>

      {/* Esquina superior derecha: Menú y pausa */}
      <div className="top-right">
      <p className="pause-text">Presiona Escape para pausar</p>
        <button className="menu-button" onClick={onPause}>
          <img src={menuIcon} alt="Menu" />
        </button>
      </div>

      {/* Centro inferior: Espacio para subtítulos */}
      <div className="bottom-center">
        <p className="subtitles">[Subtítulos aquí]</p>
      </div>
    </div>
  );
};

export default GameUI;
