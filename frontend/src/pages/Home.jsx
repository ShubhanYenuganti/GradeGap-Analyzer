import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/NavBar.jsx";
import Body from "../styles/Body.css";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <section>
          <h1>Welcome to AI Course Insights!</h1>
        </section>
        <div className="instructions">
          <p>1. To start, add your classes by selecting the create button.</p>
          <p>2. Then upload homework, quizzes, and tests by selecting the upload button.</p>
          <p>3. After this, we will provide valuable insights about your performance and suggested improvements!</p>
        </div>
      </div>
    </div>
  );
}

export default Home;