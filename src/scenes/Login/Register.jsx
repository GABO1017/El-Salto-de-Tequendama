import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../../styles/global.css';         

function Register() {
    const navigate = useNavigate();

    const handleRouterTest = () => {
        navigate('/menu'); 
    };

    return (
        <div>
            REGISTER
            <button onClick={handleRouterTest}>Ir a menu</button>
        </div>
    );
}

export default Register;