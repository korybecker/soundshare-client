import { createContext, useReducer, useEffect, Reducer, Dispatch } from "react";

import { User } from "../interfaces/User";

export const AuthContext = createContext<{
    user: State["user"];
    dispatch: Dispatch<Action>;
}>({
    user: {
        name: "",
        username: "",
        pfpUrl: "",
        email: "",
        token: "",
        userId: "",
        hasSounds: false,
    },
    dispatch: () => {},
});

interface State {
    user: User | null;
}

interface Action {
    type: "LOGIN" | "LOGOUT";
    payload?: User;
}

export const authReducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload || null };
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
