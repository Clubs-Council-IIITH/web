import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { useLazyQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "gql/queries/users";

const initialState = {
    isAuthenticated: false,
    user: {
        displayName: null,
        email: null,
    },
};

const AuthContext = createContext({
    ...initialState,
    login: () => null,
    logout: () => null,
    updateAuth: () => null,
});

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const router = useRouter();
    const [authState, setAuthState] = useState(initialState);

    // API call to fetch user details and isAuthenticated status
    const [getUser] = useLazyQuery(GET_USER_PROFILE, {
        variables: { userInput: null },
        onCompleted: ({ userMeta, userProfile }) => {
            setAuthState({
                isAuthenticated: Boolean(userProfile),
                user: { ...userMeta, ...userProfile },
            });
        },
    });

    // get currently logged in user on page load
    useEffect(getUser, []);

    // callback to log user in
    const login = () => {
        // save path to continue from
        localStorage.setItem("continue", router.pathname);

        // redirect to CAS login
        router.push("/login");
    };

    // callback to log user out
    const logout = () => {
        // save path to continue from
        localStorage.setItem("continue", router.pathname);

        // redirect to CAS logout
        router.push("/logout");
    };

    // update currently logged in user while preserving browsing state
    const updateAuth = () => {
        // fetch path to continue from
        const continuePath = localStorage.getItem("continue") || "/";

        // update auth state
        getUser();

        // redirect to continue browsing
        router.push(continuePath);
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, updateAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider, useAuth };
