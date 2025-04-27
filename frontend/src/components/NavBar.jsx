import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/NavBar.css";

export default function NavBar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setLoggedIn(!!userId);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userId');
        navigate('/');
        window.location.reload(); // Refresh UI immediately
    };

    return (
        <div className="nav-bar">
            <ul className="nav-list">
                <li className="nav-items"><Link to="/">HOME</Link></li>

                {loggedIn && (
                    <>
                        <li className="nav-items"><Link to="/create">CREATE</Link></li>
                        <li className="nav-items"><Link to="/upload">UPLOAD</Link></li>
                        <li className="nav-items"><Link to="/insights">INSIGHTS</Link></li>
                    </>
                )}

                {!loggedIn ? (
                    <>
                        <li className="nav-items"><Link to="/login">LOGIN</Link></li>
                        <li className="nav-items"><Link to="/signup">SIGNUP</Link></li>
                    </>
                ) : (
                    <li className="nav-items">
                        <a href="/" onClick={handleLogout}>SIGN OUT</a>
                    </li>
                )}
            </ul>
        </div>
    );
}
