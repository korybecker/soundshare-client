import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { environment } from "../environment";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { dispatch } = useAuthContext();

    const signup = async (data: {
        email: string;
        name: string;
        username: string;
        password: string;
        file: File | null;
    }) => {
        setIsLoading(true);
        setError(null);

        const { email, name, username, password, file } = data;

        const formData = new FormData();
        formData.append("email", email);
        formData.append("name", name);
        formData.append("username", username);
        formData.append("password", password);
        if (file) {
            formData.append("file", file);
        } else {
            formData.append("file", "");
        }
        // try to sign up user
        const response = await fetch(
            `${environment.API_URL}/api/v1/user/signup`,
            {
                method: "POST",
                body: formData,
            }
        );
        const json = await response.json();

        // if failed, response.ok is false
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error.message);
        } else {
            // save user to local storage

            // update auth context
            dispatch({ type: "LOGIN", payload: json });

            setIsLoading(false);
        }
        return json;
    };
    return { signup, isLoading, error };
};
