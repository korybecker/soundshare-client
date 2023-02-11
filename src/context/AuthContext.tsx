import React, {
    createContext,
    useReducer,
    useEffect,
    Reducer,
    FC,
} from "react";

import { User } from "../interfaces/User";

export const AuthContext = createContext({
    user: {
        name: "",
        username: "",
        pfpUrl: "",
        email: "",
        token: "",
        userId: "",
    },
    dispatch: () => {},
});

interface State {
    user: {
        name: string;
        username: string;
        pfpUrl: string;
        email: string;
        token: string;
        userId: string;
    } | null;
}

interface Action {
    type: "LOGIN" | "LOGOUT";
    payload?: User;
}

export const authReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({
    children,
}: {
    children: JSX.Element;
}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });

    useEffect(() => {
        // check for user
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        // if user, login
        if (user) {
            dispatch({ type: "LOGIN", payload: user });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
