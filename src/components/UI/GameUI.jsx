import React from "react";
import heartFull from "/textures/hearts.svg";
import heartEmpty from "/textures/shattered-heart.svg";
import menuIcon from "/textures/pause-button.svg";
const GameUI = ({ health, onPause, objective, equippedTool, isCinematic, subtitles }) => {
  const maxHearts = 5;
  const hearts = Array.from({ length: maxHearts }, (_, i) =>
    i < health / 10 ? heartFull : heartEmpty
  );
 
  return (
    <div className="game-ui">
      {!isCinematic && (
        <>
          <div className="top-left">
            <div className="hearts">
              {hearts.map((heart, index) => (
                <img key={index} src={heart} alt="heart" className="heart-icon" />
              ))}
            </div>
            <p className="objective-text">{objective}</p>
          </div>
 
          <div className="top-right">
            <p className="pause-text">Presiona Escape para pausar</p>
            <button className="menu-button" onClick={onPause}>
              <img src={menuIcon} alt="Menu" />
            </button>
          </div>
 
          {equippedTool && (
            <div className="bottom-left">
              <img
                src={equippedTool}
                alt="Herramienta equipada"
                className="tool-icon"
              />
            </div>
          )}
        </>
      )}
 
      <div className="bottom-center">
        <p className="subtitles">{subtitles}</p>
      </div>
    </div>
  );
};
 
 
export default GameUI;
 