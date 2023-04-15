import { useEffect } from "react";
import { useAuth } from "contexts/AuthContext";

export default function AuthRedirect() {
    const { updateAuth } = useAuth();
    useEffect(() => {
        updateAuth();
    }, []);

    return null;
}
