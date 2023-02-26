import { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Card from "@mui/material/Card";
import Person from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import Download from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Sound } from "../interfaces/Sound";
import { Link } from "react-router-dom";
import { memo } from "react";
import { environment } from "../environment";

import "../App.css";
import "./Player.css";
import axios from "axios";

const convertTime = (dateString: string) => {
    let date = new Date(dateString);
    let currentDate = new Date();

    let timeDiff = Math.abs(currentDate.getTime() - date.getTime());

    let diffMinutes = Math.floor(timeDiff / 1000 / 60);
    let diffHours = Math.floor(diffMinutes / 60);
    let diffDays = Math.floor(diffHours / 24);
    let diffMonths = Math.floor(diffDays / 30);
    let diffYears = Math.floor(diffMonths / 12);

    let timeAgo;
    if (diffMinutes < 1) {
        timeAgo = "Less than a minute ago";
    } else if (diffMinutes < 60) {
        timeAgo =
            `${diffMinutes} minute` + (diffMinutes === 1 ? "" : "s") + " ago";
    } else if (diffHours < 24) {
        timeAgo = `${diffHours} hour` + (diffHours === 1 ? "" : "s") + " ago";
    } else if (diffDays < 30) {
        timeAgo = `${diffDays} day` + (diffDays === 1 ? "" : "s") + " ago";
    } else if (diffMonths < 12) {
        timeAgo =
            `${diffMonths} month` + (diffMonths === 1 ? "" : "s") + " ago";
    } else {
        timeAgo = `${diffYears} year` + (diffYears === 1 ? "" : "s") + " ago";
    }
    return timeAgo;
};

const Player = memo(
    ({
        sound,
        loggedIn,
        setSounds,
        loggedInUserId,
        userToken,
        liked,
        onLike,
        onUnlike,
        onEditClick,
    }: {
        sound: Sound;
        loggedIn: boolean;
        setSounds: (sounds: Sound[]) => void;
        loggedInUserId: string;
        userToken: string;
        liked: boolean;
        onLike: () => void;
        onUnlike: () => void;
        onEditClick: (e: React.MouseEvent, sound: Sound) => void;
    }) => {
        const downloadFile = async (e: React.MouseEvent) => {
            e.preventDefault();

            try {
                const response = await axios.get(
                    `${environment.API_URL}/api/v1/sound/${sound._id}/download`,
                    {
                        responseType: "arraybuffer",
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                const file = new Blob([response.data], {
                    type: response.headers["content-type"],
                });

                // Create a link element to initiate the download
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(file);
                link.download = sound.title + ".mp3";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                console.error(err);
            }
        };

        const unlike = async (e: React.MouseEvent) => {
            e.preventDefault();
            try {
                const res = await axios.delete(
                    `${environment.API_URL}/api/v1/sound/${sound._id}/unlike`,
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                onUnlike();
            } catch (err) {
                console.error(err);
            }
        };

        const like = async (e: React.MouseEvent) => {
            e.preventDefault();
            try {
                const res = await axios.post(
                    `${environment.API_URL}/api/v1/sound/${sound._id}/like`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                onLike();
            } catch (error) {
                console.error(error);
            }
        };

        return (
            <div className="sound-block">
                <Card>
                    <div className="sound-title">
                        <h3
                            style={{
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {sound.title}
                        </h3>
                        <div style={{ width: "auto" }}>
                            {loggedIn &&
                                sound.uploadedBy === loggedInUserId && (
                                    <Button
                                        component="div"
                                        color="warning"
                                        onClick={(e) => onEditClick(e, sound)}
                                    >
                                        <EditIcon />
                                    </Button>
                                )}
                            {loggedIn && (
                                <Button
                                    component="div"
                                    color="error"
                                    onClick={(e) => downloadFile(e)}
                                >
                                    <Download />
                                </Button>
                            )}
                            <Button
                                component="div"
                                color={liked ? "error" : "inherit"}
                                onClick={
                                    liked ? (e) => unlike(e) : (e) => like(e)
                                }
                                disabled={!loggedIn}
                            >
                                <FavoriteBorderIcon />
                                <div
                                    style={{
                                        fontSize: "1rem",
                                        marginLeft: "0.5rem",
                                    }}
                                >
                                    {sound.likes}
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className="sound-data">
                        <div className="user">
                            <Person />
                            <Link to={`/profile/${sound.username}`}>
                                <p className="username">{sound.username}</p>
                            </Link>
                        </div>
                        <p>{convertTime(sound.createdAt)}</p>
                    </div>

                    <AudioPlayer
                        key={sound._id}
                        src={sound.url}
                        showSkipControls={false}
                        showJumpControls={false}
                        autoPlay={false}

                        // other props here
                    />
                </Card>
            </div>
        );
    }
);

export default Player;
