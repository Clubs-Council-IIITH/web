import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import cookieCutter from "cookie-cutter";

import { useLazyQuery } from "@apollo/client";
import { GET_USER } from "gql/queries/auth";

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
    const [getUser] = useLazyQuery(GET_USER, {
        variables: { userInput: null },
        onCompleted: ({ userMeta, userProfile }) => {
            setAuthState({
                isAuthenticated: Boolean(userProfile),
                user: { ...userMeta, ...userProfile },
            });
        },
    });

    // get currently logged in user on page load
    useEffect(() => {
        // if `logout` flag is set, redirect to auth server to expire token
        if (cookieCutter.get("logout")) {
            // console.log("logging out...");

            // clear `logout` flag
            cookieCutter.set("logout", "", { expires: new Date(0) });

            router.push("/logoutCallback");
            return;
        }

        // else get user profile
        getUser();
    }, []);

    // callback to log user in
    const login = () => {
        // save path to continue from
        cookieCutter.set("continue", router.asPath);

        // redirect to CAS login
        router.push("/login");
    };

    // callback to log user out
    const logout = () => {
        // save path to continue from
        cookieCutter.set("continue", router.asPath);

        // set flag to expire token the next time someone visits the site, because CAS doesn't follow ?service for some reason
        cookieCutter.set("logout", true);

        // redirect to CAS logout
        router.push("/logout");
    };

    // update currently logged in user while preserving browsing state
    const updateAuth = () => {
        // fetch path to continue from
        const continuePath = cookieCutter.get("continue") || "/";

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
