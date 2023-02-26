import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";

import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { environment } from "../environment";

import "../App.css";

import axios from "axios";

const Upload = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { user } = useAuthContext();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        if (!user) {
            return;
        }
        e.preventDefault();

        if (title.length === 0) {
            return setError("Title is required");
        }
        if (description.length === 0) {
            return setError("Description is required");
        }
        if (file === null) {
            return setError("File is required");
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("title", title);
        data.append("description", description);
        data.append("file", file);
        data.append("uploadedBy", user.userId);

        try {
            await axios.post(`${environment.API_URL}/api/v1/sound`, data, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            navigate("/sounds");
        }
    };

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Upload</h1>
            <form action="#" className="signupform" onSubmit={handleSubmit}>
                <FormControl sx={{ width: "100%" }}>
                    <FormControl margin="normal">
                        <div className="formelement">
                            <InputLabel htmlFor="title">Title</InputLabel>
                            <Input
                                id="title"
                                aria-describedby="title-text"
                                fullWidth={true}
                                value={title}
                                onChange={(e) => {
                                    if (error.split(" ")[0] === "Title") {
                                        setError("");
                                    }
                                    setTitle(e.target.value);
                                }}
                                type="text"
                            />
                        </div>
                    </FormControl>
                    <FormControl margin="normal">
                        <div className="formelement">
                            <InputLabel htmlFor="description">
                                Description
                            </InputLabel>
                            <Input
                                id="description"
                                aria-describedby="description-text"
                                fullWidth={true}
                                value={description}
                                onChange={(e) => {
                                    if (error.split(" ")[0] === "Description") {
                                        setError("");
                                    }
                                    setDescription(e.target.value);
                                }}
                            />
                        </div>
                    </FormControl>
                    <FormControl margin="normal">
                        <div className="formelement">
                            <label htmlFor="file">
                                <input
                                    accept="audio/*"
                                    style={{ display: "none" }}
                                    id="file"
                                    type="file"
                                    onChange={(e) => {
                                        if (!e.target.files) return;
                                        if (e.target.files[0].size > 10485760) {
                                            setError(
                                                "File size cannot exceed 10MB"
                                            );
                                            setFile(null);
                                            return;
                                        }
                                        if (error.split(" ")[0] === "File") {
                                            setError("");
                                        }
                                        setFile(e.target.files[0]);
                                    }}
                                ></input>
                                <Button
                                    component="span"
                                    variant="outlined"
                                    color="secondary"
                                    disabled={isLoading}
                                >
                                    Choose a file <UploadIcon />
                                </Button>
                                <div style={{ textAlign: "center" }}>
                                    <strong>{file && file.name}</strong>
                                </div>
                            </label>
                        </div>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                    >
                        Upload
                    </Button>
                </FormControl>
                {error && <strong className="error">{error}</strong>}
            </form>
        </>
    );
};

export default Upload;
