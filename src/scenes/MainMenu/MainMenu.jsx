import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../../styles/Menu.module.css';         

function MainMenu() {
    const navigate = useNavigate();

    const handleRouterTest = () => {
        navigate('/'); 
    };

    return (
        <div>
            MAIN MENU
            <button onClick={handleRouterTest}>Volver a login</button>
        </div>
    );
}

export default MainMenu;