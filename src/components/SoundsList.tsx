import { useState, useEffect, useMemo, useCallback } from "react";

import Player from "./Player";

import { Sound } from "../interfaces/Sound";
import { User } from "../interfaces/User";
import { environment } from "../environment";

import axios from "axios";

const SoundsList = ({ user }: { user: User | null }) => {
    const [sounds, setSounds] = useState<Sound[]>([]);
    const [likes, setLikes] = useState<string[]>([]);

    const fetchData = async () => {
        if (sounds && sounds.length > 0) return sounds;
        const res = await axios.get(`${environment.API_URL}/api/v1/sound`);
        setSounds(res.data);
        if (user && user.token) {
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

    const handleLike = useCallback((soundId: string) => {
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
    }, []);

    const handleUnlike = useCallback((soundId: string) => {
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
    }, []);

    const memoizedSounds = useMemo(() => sounds, [sounds]);
    const memoizedLikes = useMemo(() => likes, [likes]);

    return (
        <>
            {memoizedSounds &&
                memoizedSounds.map((sound, i) => (
                    <Player
                        liked={memoizedLikes.includes(sound._id)}
                        key={i}
                        sound={sound}
                        username={user?.username || ""}
                        setSounds={setSounds}
                        loggedIn={user && user.token ? true : false}
                        userToken={user?.token || ""}
                        onLike={() => handleLike(sound._id)}
                        onUnlike={() => handleUnlike(sound._id)}
                    />
                ))}
        </>
    );
};

export default SoundsList;
