import { createContext, useState, useContext } from "react";
import { useRouter } from "next/router";

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

    const login = () => {
        // save path to continue from
        localStorage.setItem("continue", router.pathname);

        // redirect to CAS login
        router.push("/login");
    };

    const logout = () => {
        // save path to continue from
        localStorage.setItem("continue", router.pathname);

        // redirect to CAS logout
        router.push("/logout");
    };

    const updateAuth = () => {
        // fetch path to continue from
        const continuePath = localStorage.getItem("continue");

        // update auth state
        // TODO: API call to fetch user details and isAuthenticated status
        setAuthState({
            isAuthenticated: true,
            user: {
                displayName: "User Name",
                email: "user.name@research.iiit.ac.in",
            },
        });

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
