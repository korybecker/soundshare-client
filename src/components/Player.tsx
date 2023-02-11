import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Card from "@mui/material/Card";
import Person from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import Download from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { Sound } from "../interfaces/Sound";
import { Link } from "react-router-dom";
import { useState } from "react";

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
        timeAgo = `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
        timeAgo = `${diffHours} hours ago`;
    } else if (diffDays < 30) {
        timeAgo = `${diffDays} days ago`;
    } else if (diffMonths < 12) {
        timeAgo = `${diffMonths} months ago`;
    } else {
        timeAgo = `${diffYears} years ago`;
    }
    return timeAgo;
};

const Player = ({
    sound,
    username,
    loggedInUserId,
    setSounds,
    userToken,
}: {
    sound: Sound;
    username: string;
    loggedInUserId: string;
    setSounds: (sounds: Sound[]) => void;
    userToken: string;
}) => {
    const [deleting, setDeleting] = useState(false);
    const deleteSound = async (e: React.MouseEvent) => {
        e.preventDefault();
        setDeleting(true);
        try {
            const res = await axios.delete(
                `${process.env.SERVER_URL}/api/v1/sound/${sound._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                    data: {
                        url: sound.url,
                    },
                }
            );
            setSounds((prevSounds: Sound[]) =>
                prevSounds.filter((s: Sound) => s._id !== sound._id)
            );
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    const downloadFile = async (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        try {
            const response = await axios({
                url,
                method: "GET",
                responseType: "blob", // important
            });
            const file = new Blob([response.data], {
                type: response.headers["content-type"],
            });

            // Create a link element to initiate the download
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(file);
            link.download = sound.title;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="sound-block">
            <Card>
                <div className="sound-title">
                    <h3 style={{ flexGrow: 1 }}>{sound.title}</h3>
                    <div style={{ width: "auto" }}>
                        {deleting && <strong>Deleting...</strong>}
                        {loggedInUserId !== "" &&
                            sound.uploadedBy === loggedInUserId && (
                                <Button
                                    component="div"
                                    color="error"
                                    onClick={(e) => deleteSound(e)}
                                    disabled={deleting}
                                >
                                    <DeleteIcon />
                                </Button>
                            )}
                        {loggedInUserId !== "" && (
                            <Button
                                component="div"
                                color="error"
                                onClick={(e) => downloadFile(e, sound.url)}
                            >
                                <Download />
                            </Button>
                        )}
                    </div>
                </div>
                <div className="sound-data">
                    <div className="user">
                        <Person />
                        <Link
                            to={`/profile/${
                                username ? username : sound.username
                            }`}
                        >
                            <p className="username">
                                {username ? username : sound.username}
                            </p>
                        </Link>
                    </div>
                    <p>
                        {convertTime(new Date(sound.createdAt).toDateString())}
                    </p>
                </div>

                <AudioPlayer
                    src={sound.url}
                    showSkipControls={false}
                    showJumpControls={false}

                    // other props here
                />
            </Card>
        </div>
    );
};

export default Player;
