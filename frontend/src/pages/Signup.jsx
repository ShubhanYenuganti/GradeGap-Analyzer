import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";
import "../styles/Login.css";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, confirmPassword } = formData;
    
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
    
        // Fetch existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
    
        // Check if email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            setError("Email already in use.");
            return;
        }
    
        // Add new user
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
    
        // 🚫 Don't auto-login after signup
        navigate('/login'); // ✅ Force user to go log in manually
    };
    

    return (
        <div>
            <Navbar />
            <div className="login-container">
                <div className="login-box">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
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
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="login-button">
                            Sign Up
                        </button>
                    </form>
                    <p className="signup-text">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
