import { useEffect, useState } from "react";

import axios from "axios";
import Player from "../../components/Player";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./styles.css";
import { Sound } from "../../interfaces/Sound";

const UserProfile = () => {
    // const [user, setUser] = useState();
    const [sounds, setSounds] = useState<Sound[]>();
    const { user } = useAuthContext();

    useEffect(() => {
        if (user) {
            const username = user.username;
            axios
                .get(`${process.env.SERVER_URL}/api/v1/user/${username}`)
                .then((res) => {
                    const { name, pfpUrl } = res.data;
                    setSounds(res.data.sounds);
                })
                .catch((err) => console.error(err));
        }
    }, []);
    return (
        <>
            <div className="main">
                <div className="half">
                    <h1>{user && `${user.username}'s Profile`}</h1>
                    <img src={user && user.pfpUrl} alt=">///<" />
                </div>
                <div className="half">
                    {sounds && sounds.length > 0 ? (
                        <h1 style={{ height: "1rem" }}>Sounds</h1>
                    ) : (
                        <h1 style={{ height: "1rem" }}>No Sounds</h1>
                    )}
                    {sounds &&
                        sounds.map((sound, i) => {
                            return (
                                <Player
                                    key={i}
                                    sound={sound}
                                    username=""
                                    setSounds={setSounds}
                                    loggedInUserId={user ? user.userId : ""}
                                    userToken={user ? user.token : ""}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
