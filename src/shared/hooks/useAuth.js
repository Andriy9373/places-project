import { useState, useEffect, useCallback } from "react";

let logoutTimer = null;

export const useAuth = () => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(false);
    const [tokenExpiration, setTokenExpiration] = useState(null);

    const login =  useCallback((id, userToken, expirationDate) => {
        setToken(userToken);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpiration(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify({
            userId: id,
            token: userToken,
            expiration: tokenExpirationDate.toISOString(),
        }));
        setUserId(id);
    }, []);

    const logout =  useCallback(() => {
        setToken(null);
        setTokenExpiration(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpiration) {
            const remainingTime = tokenExpiration.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        }
        else {
            clearTimeout(logoutTimer);
        }
    }, [token, tokenExpiration, logout]);
    
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    return { userId, token, login, logout };
}