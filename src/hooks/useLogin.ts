import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { environment } from "../environment";

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { dispatch } = useAuthContext();

    const login = async (formState: { email: string; password: string }) => {
        const { email, password } = formState;
        setIsLoading(true);
        setError(null);

        // try to login user
        const response = await fetch(
            `${environment.API_URL}/api/v1/user/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );
        const json = await response.json();

        // if failed, response.ok is false
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error.message);
        } else {
            // save user to local storage
            localStorage.setItem("user", JSON.stringify(json));

            // update auth context
            dispatch({ type: "LOGIN", payload: json });

            setIsLoading(false);
        }
        return json;
    };
    return { login, isLoading, error };
};
