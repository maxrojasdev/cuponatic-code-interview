import React from 'react';
import Logo from '../.assets/logo-cuponatic.jpeg'
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="d-flex justify-content-center align-items-center p-2">
            <Link to="/">
                <img style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    onClick={() => {
                        localStorage.setItem("welcome", true)
                        window.location.reload()
                    }}
                    src={Logo} alt="Cuponatic Logo" />
            </Link>
            <div className="font-header0">Mini tienda Cuponatic</div>
        </div>
    )
}
