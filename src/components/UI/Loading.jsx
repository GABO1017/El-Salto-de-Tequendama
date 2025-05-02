import React, { useState, useEffect } from "react";
import logo1 from "../../assets/images/MuiscaIcons/logo1.png";
import logo2 from "../../assets/images/MuiscaIcons/logo2.png";
import logo3 from "../../assets/images/MuiscaIcons/logo3.png";
import logo4 from "../../assets/images/MuiscaIcons/logo4.png";
import logo5 from "../../assets/images/MuiscaIcons/logo5.png";
import logo6 from "../../assets/images/MuiscaIcons/logo6.png";
import logo7 from "../../assets/images/MuiscaIcons/logo7.png";
import logo8 from "../../assets/images/MuiscaIcons/logo8.png";
import logo9 from "../../assets/images/MuiscaIcons/logo9.png";
import logo10 from "../../assets/images/MuiscaIcons/logo10.png";
import logo11 from "../../assets/images/MuiscaIcons/logo11.png";
import logo12 from "../../assets/images/MuiscaIcons/logo12.png";
import logo13 from "../../assets/images/MuiscaIcons/logo13.png";
import logo14 from "../../assets/images/MuiscaIcons/logo14.png";
import logo15 from "../../assets/images/MuiscaIcons/logo15.png";
import logo16 from "../../assets/images/MuiscaIcons/logo16.png";
import logo17 from "../../assets/images/MuiscaIcons/logo17.png";
import logo18 from "../../assets/images/MuiscaIcons/logo18.png";
import logo19 from "../../assets/images/MuiscaIcons/logo19.png";
import logo20 from "../../assets/images/MuiscaIcons/logo20.png";
import logo21 from "../../assets/images/MuiscaIcons/logo21.png";
import logo22 from "../../assets/images/MuiscaIcons/logo22.png";
import logo23 from "../../assets/images/MuiscaIcons/logo23.png";
import logo24 from "../../assets/images/MuiscaIcons/logo24.png";
import logo25 from "../../assets/images/MuiscaIcons/logo25.png";
import logo26 from "../../assets/images/MuiscaIcons/logo26.png";
import "../../styles/global.css";

const Loading = () => {
  // Lista de iconos (URLs o paths de los íconos que quieres usar)
  const icons = [
    logo1,
    logo2,
    logo3,
    logo4,
    logo5,
    logo6,
    logo7,
    logo8,
    logo9,
    logo10,
    logo11,
    logo12,
    logo13,
    logo14,
    logo15,
    logo16,
    logo17,
    logo18,
    logo19,
    logo20,
    logo21,
    logo22,
    logo23,
    logo24,
    logo25,
    logo26,
  ];

  const [currentIcon, setCurrentIcon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Cambia el icono a uno aleatorio
      setCurrentIcon(Math.floor(Math.random() * icons.length));
    }, 300); // Tiempo de cambio (ajustable)

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [icons.length]);

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <img
          src={icons[currentIcon]}
          alt="Loading icon"
          className="loading-icon"
        />
        <p className="loading-text">Cargando...</p>
      </div>
    </div>
  );
};

export default Loading;
