import { useState, useEffect } from "react";
import axios from "axios";
import { Sound } from "../interfaces/Sound";
import { environment } from "../environment";
import "../App.css";

import { useAuthContext } from "../hooks/useAuthContext";

import Player from "../components/Player";

const Sounds = () => {
    const [sounds, setSounds] = useState<Sound[] | null>(null);

    const { user } = useAuthContext();

    const fetchData = async () => {
        if (sounds && sounds.length > 0) return sounds;
        const { data } = await axios.get(`${environment.API_URL}/api/v1/sound`);
        setSounds(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Sounds</h1>
            {/* <SoundsList sounds={sounds} /> */}
            <div className="container">
                {sounds &&
                    sounds.map((sound, i) => (
                        <Player
                            key={i}
                            sound={sound}
                            username=""
                            setSounds={setSounds}
                            loggedInUserId={user ? user.userId : ""}
                            userToken={user ? user.token : ""}
                        />
                    ))}
            </div>
        </>
    );
};

export default Sounds;
