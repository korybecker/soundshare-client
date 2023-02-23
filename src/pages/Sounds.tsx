import { useState, useEffect } from "react";
import axios from "axios";
import { Sound } from "../interfaces/Sound";
import { environment } from "../environment";
import "../App.css";

import { useAuthContext } from "../hooks/useAuthContext";

import Player from "../components/Player";

const Sounds = () => {
    const [sounds, setSounds] = useState<Sound[]>([]);
    const [likes, setLikes] = useState<string[]>([]);
    const { user } = useAuthContext();

    const fetchData = async () => {
        if (sounds && sounds.length > 0) return sounds;
        const res = await axios.get(`${environment.API_URL}/api/v1/sound`);
        setSounds(res.data);
        if (user) {
            const { data } = await axios.get(
                `${environment.API_URL}/api/v1/like/${user.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setLikes(data);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleLike = (soundId: string) => {
        setSounds((prevSounds) => {
            const updatedSounds = prevSounds.map((sound) => {
                if (sound._id === soundId) {
                    return { ...sound, likes: sound.likes + 1 };
                }
                return sound;
            });
            return updatedSounds;
        });

        setLikes((prevLikes) => [...prevLikes, soundId]);
    };

    const handleUnlike = (soundId: string) => {
        setSounds((prevSounds) => {
            const updatedSounds = prevSounds.map((sound) => {
                if (sound._id === soundId) {
                    return { ...sound, likes: sound.likes - 1 };
                }
                return sound;
            });
            return updatedSounds;
        });
        setLikes((prevLikes) => prevLikes.filter((id) => id !== soundId));
    };

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Sounds</h1>
            {/* <SoundsList sounds={sounds} /> */}
            <div className="container">
                {sounds &&
                    sounds.map((sound, i) => (
                        <Player
                            liked={likes.includes(sound._id)}
                            key={i}
                            sound={sound}
                            username=""
                            setSounds={setSounds}
                            loggedInUserId={user ? user.userId : ""}
                            userToken={user ? user.token : ""}
                            onLike={() => handleLike(sound._id)}
                            onUnlike={() => handleUnlike(sound._id)}
                        />
                    ))}
            </div>
        </>
    );
};

export default Sounds;
