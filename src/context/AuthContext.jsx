import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });


    useEffect(() => {
        if (user) {
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);


    useEffect(() => {
        if (token) {
            localStorage.setItem(
                "token",
                token
            );
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);


    function login(loginData) {
        setUser(loginData.user);
        setToken(loginData.token);
    }


    function logout() {
        setUser(null);
        setToken(null);
    }


    const isLoggedIn = !!token;
    const isAdmin = user?.role === "admin";


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoggedIn,
                isAdmin,
                login,
                logout,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;