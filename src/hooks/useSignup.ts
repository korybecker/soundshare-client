import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { environment } from "../environment";

import { User } from "../interfaces/User";

import axios from "axios";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { dispatch } = useAuthContext();

    const signup = async (data: FormData) => {
        setIsLoading(true);
        setError(null);

        axios
            .post(`${environment.API_URL}/api/v1/user/signup`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                const user: User = res.data;
                dispatch({ type: "LOGIN", payload: user });
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                console.error(err);
            });
    };
    return { signup, isLoading, error };
};
