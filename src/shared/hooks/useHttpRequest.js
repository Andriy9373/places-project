import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const activeHttpRequests = useRef([]);

    const clearError = () => {
        setError(null);
    }

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortController.signal,
            });
            const data = await response.json();
            activeHttpRequests.current = activeHttpRequests.current.filter(controller => controller !== httpAbortController);
            if (![200, 201, 204].includes(data.statusCode)) {
                throw new Error(data.message);
            }
            setIsLoading(false);
            return data;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            setIsLoading(false);
            throw err;
        }
    }, []);

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(controller => {
                controller.abort();
            });
        }
    }, []);

    return { sendRequest, isLoading, error, clearError };
}