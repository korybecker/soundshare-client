import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import "../App.css";

const About = () => {
    const { user } = useAuthContext();

    return (
        <div className="container">
            <h1>Welcome to SoundShare</h1>
            <Link to="/sounds">
                <h3>View All Sounds</h3>
            </Link>
            {user ? (
                <Link to="/upload">
                    <h3>Upload a Sound</h3>
                </Link>
            ) : (
                <Link to="/login">
                    <h3>Login</h3>
                </Link>
            )}
        </div>
    );
};

export default About;
