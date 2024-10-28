import React from 'react';
import useAuthStore from "../../services/auth";
import { useNavigate } from 'react-router-dom';
import './../../styles/Menu.module.css';         

function MainMenu() {
    const { logoutUser, user } = useAuthStore();
    const navigate = useNavigate();  // Obtén el navigate

    const handleLogout = () => {
      logoutUser(navigate);  // Pasa navigate como argumento al cerrar sesión
    };

    return (
        <div>
            Bienvenido, {user?.username || 'Invitado'}!
            MAIN MENU
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}

export default MainMenu;