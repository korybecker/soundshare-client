import "../App.css";

import { useAuthContext } from "../hooks/useAuthContext";

import SoundsList from "../components/SoundsList";

const Sounds = () => {
    const { user } = useAuthContext();

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Sounds</h1>
            <div className="container">
                <SoundsList user={user} />
            </div>
        </>
    );
};

export default Sounds;
