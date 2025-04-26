import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";
import "../styles/Login.css"; // Import your CSS file for styling

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: "", // Can be email OR username
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { identifier, password } = formData;

        // Dummy login logic
        const validEmailsOrUsernames = ["test@example.com", "testuser"];
        const validPassword = "password123";

        if (validEmailsOrUsernames.includes(identifier) && password === validPassword) {
            // Simulate successful login
            navigate("/home");
        } else {
            setError(
                "Invalid email/username or password. Try 'test@example.com' or 'testuser' with 'password123'."
            );
        }
    };

    return (
        <div>
            <Navbar />
            <div className="login-container">
                <div className="login-box">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email or Username</label>
                            <input
                                type="text"
                                name="identifier"
                                placeholder="Email or Username"
                                value={formData.identifier}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>
                    <p className="signup-text">
                        Don't have an account? <Link to="/signup">Sign up here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
