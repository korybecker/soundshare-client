import { useState, useEffect, useMemo, useCallback } from "react";

import Player from "./Player";

import { Sound } from "../interfaces/Sound";
import { User } from "../interfaces/User";
import { environment } from "../environment";

import axios from "axios";

const SoundsList = ({
    user,
    isProfile,
    loggedInUserId,
    username,
    onEditClick,
    updatedSound,
}: {
    user: User | null;
    isProfile: boolean;
    loggedInUserId: string;
    username: string;
    onEditClick: (e: React.MouseEvent, sound: Sound) => void;
    updatedSound: boolean;
}) => {
    const [sounds, setSounds] = useState<Sound[]>([]);
    const [likes, setLikes] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user && isProfile) {
                const res = await axios.get(
                    `${environment.API_URL}/api/v1/sound/user/${user.userId}`
                );
                setSounds(res.data);
            } else {
                const res = await axios.get(
                    `${environment.API_URL}/api/v1/sound`
                );
                setSounds(res.data);
            }
            if (user && user.token) {
                const { data } = await axios.get(
                    `${environment.API_URL}/api/v1/like/${loggedInUserId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setLikes(data);
            }
        };
        (async () => {
            fetchData();
        })();
    }, [user, isProfile, username, updatedSound]);

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

    const memoizedLikes = useMemo(() => likes, [likes]);

    return (
        <>
            {sounds &&
                sounds
                    .slice(0)
                    .reverse()
                    .map((sound, i) => (
                        <Player
                            liked={memoizedLikes.includes(sound._id)}
                            key={i}
                            sound={sound}
                            setSounds={setSounds}
                            loggedInUserId={loggedInUserId}
                            loggedIn={user && user.token ? true : false}
                            userToken={user?.token || ""}
                            onLike={() => handleLike(sound._id)}
                            onUnlike={() => handleUnlike(sound._id)}
                            onEditClick={onEditClick}
                        />
                    ))}
        </>
    );
};

export default SoundsList;
