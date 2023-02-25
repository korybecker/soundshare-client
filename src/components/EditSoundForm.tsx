import { useState } from "react";

import { Sound } from "../interfaces/Sound";
import { User } from "../interfaces/User";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";

import { environment } from "../environment";

const EditSoundForm = ({
    sound,
    user,
    onClose,
}: {
    sound: Sound | null;
    user: User;
    onClose: () => void;
}) => {
    const [title, setTitle] = useState<string>(sound?.title || "");
    const [description, setDescription] = useState<string>(
        sound?.description || ""
    );

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [deleting, setDeleting] = useState(false);

    const deleteSound = async (e: React.MouseEvent) => {
        if (!sound || !user) {
            return;
        }
        e.preventDefault();
        setDeleting(true);
        try {
            const res = await axios.delete(
                `${environment.API_URL}/api/v1/sound/${sound._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    data: {
                        url: sound.url,
                    },
                }
            );
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (!user || !sound) {
            return;
        }
        e.preventDefault();

        if (title.length === 0) {
            return setError("Title is required");
        }
        if (description.length === 0) {
            return setError("Description is required");
        }
        if (title === sound?.title && description === sound.description) {
            return setError("Make changes before submitting");
        }

        setIsLoading(true);

        const data = new FormData();
        data.set("title", title);
        data.set("description", description);

        try {
            const updatedSound = await axios.patch(
                `${environment.API_URL}/api/v1/sound/${sound._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <h1>Update Sound</h1>
            <form
                action="#"
                className="signupform"
                onSubmit={handleSubmit}
                style={{ width: "80%" }}
            >
                <FormControl sx={{ width: "100%" }}>
                    <FormControl margin="normal" color="error">
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                        }}
                    >
                        <Button
                            type="submit"
                            color="error"
                            variant="contained"
                            disabled={isLoading}
                        >
                            Update
                        </Button>
                        <Button
                            type="button"
                            color="error"
                            variant="outlined"
                            disabled={isLoading}
                            onClick={() => onClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            component="div"
                            color="error"
                            onClick={(e) => deleteSound(e)}
                            disabled={deleting}
                        >
                            <DeleteIcon />
                        </Button>
                    </div>
                </FormControl>
                {error && <strong className="error">{error}</strong>}
            </form>
        </div>
    );
};

export default EditSoundForm;
