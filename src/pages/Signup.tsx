import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";

import { useSignup } from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formState, setFormState] = useState({
        email: "",
        name: "",
        username: "",
        password: "",
    });

    const [file, setFile] = useState<string | Blob>("");

    const navigate = useNavigate();
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, name, username, password } = formState;

        const data = new FormData();
        data.append("email", email);
        data.append("name", name);
        data.append("username", username);
        data.append("password", password);
        data.append("file", file);

        await signup(data);
        navigate("/profile");
    };

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Sign up</h1>
            <form className="signupform" onSubmit={handleSubmit}>
                <FormControl sx={{ width: "100%" }}>
                    <FormControl margin="normal" color="error">
                        <div className="formelement">
                            <InputLabel htmlFor="email">
                                Email address
                            </InputLabel>
                            <Input
                                id="email"
                                aria-describedby="email-text"
                                fullWidth={true}
                                value={formState.email}
                                onChange={(e) => {
                                    setFormState({
                                        ...formState,
                                        email: e.target.value,
                                    });
                                }}
                                type="email"
                            />
                        </div>
                    </FormControl>
                    <FormControl margin="normal">
                        <div className="formelement">
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <Input
                                id="name"
                                aria-describedby="name-text"
                                fullWidth={true}
                                value={formState.name}
                                onChange={(e) => {
                                    setFormState({
                                        ...formState,
                                        name: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </FormControl>
                    <FormControl margin="normal">
                        <div className="formelement">
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input
                                id="username"
                                aria-describedby="username-text"
                                fullWidth={true}
                                value={formState.username}
                                onChange={(e) => {
                                    setFormState({
                                        ...formState,
                                        username: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </FormControl>
                    <FormControl margin="normal">
                        <div className="formelement">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"
                                aria-describedby="password-text"
                                fullWidth={true}
                                value={formState.password}
                                onChange={(e) => {
                                    setFormState({
                                        ...formState,
                                        password: e.target.value,
                                    });
                                }}
                                type="password"
                            />
                        </div>
                    </FormControl>
                    <FormControl margin="normal">
                        <div className="formelement">
                            <label htmlFor="file">
                                <input
                                    name="file"
                                    accept="image/png, image/jpeg"
                                    style={{ display: "none" }}
                                    id="file"
                                    type="file"
                                    onChange={(e) => {
                                        if (!e.target.files) return;
                                        setFile(e.target.files[0]);
                                    }}
                                ></input>
                                <Button
                                    component="span"
                                    variant="outlined"
                                    color="secondary"
                                    disabled={isLoading}
                                >
                                    Choose a profile picture <UploadIcon />
                                </Button>
                                {file &&
                                    (file instanceof Blob ? file.name : file)}
                            </label>
                        </div>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                    >
                        Signup
                    </Button>
                </FormControl>
                {error && <div className="error">{error}</div>}
            </form>
        </>
    );
};

export default Signup;