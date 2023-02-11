import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { environment } from "../../environment";
import "./styles.css";

import axios from "axios";
import Player from "../../components/Player";
import { Sound } from "../../interfaces/Sound";

const UserProfile = () => {
    const { username } = useParams();
    if (!username) {
        return <h1>No user</h1>;
    }
    const [user, setUser] = useState<{
        name: string;
        pfpUrl: string;
        userId?: string;
        username: string;
        token?: string;
    }>();
    const [sounds, setSounds] = useState<Sound[]>();
    useEffect(() => {
        axios
            .get(`${environment.API_URL}/api/v1/user/${username}`)
            .then((res) => {
                const { name, pfpUrl } = res.data;
                setUser({ name, pfpUrl, username });
                setSounds(res.data.sounds);
            })
            .catch((err) => console.error(err));
    }, [username]);
    return (
        <>
            <div className="main">
                <div className="half">
                    <h1>{user && `${user.username}'s Profile`}</h1>

                    <img src={user && user.pfpUrl} alt=">///<" />
                </div>
                <div className="half">
                    <h1 style={{ height: "1rem" }}>Sounds</h1>
                    {sounds &&
                        sounds.map((sound: Sound, i: number) => {
                            return (
                                <Player
                                    key={i}
                                    sound={sound}
                                    username={username}
                                    setSounds={setSounds}
                                    loggedInUserId={user?.userId || ""}
                                    userToken={user?.token || ""}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
