import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formState, setFormState] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await login(formState);
        navigate(`/profile/${res.username}`);
    };

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Log in</h1>
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
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                    >
                        Login
                    </Button>
                </FormControl>
                {error && <div className="error">{error}</div>}
            </form>
        </>
    );
};

export default Login;
