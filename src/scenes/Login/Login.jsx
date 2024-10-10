import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../../styles/global.css';         

function Login() {
    const navigate = useNavigate();

    const handleRouterTest = () => {
        navigate('/registro'); 
    };

    return (
        <div>
            LOGIN
            <button onClick={handleRouterTest}>Ir a registro</button>
        </div>
    );
}

export default Login;