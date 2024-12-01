import {create} from "zustand"

export const useAuthStore = create((set) => ({
    isAuthenticated: false,
    user: null,
    checkAuthStatus: async () => {
        const res = await fetch("/api/auth/check", {
            method: "GET",
            credentials: "include", // This ensures cookies (like session cookies) are sent with the request
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!res.authenticated) {
            // If response is not ok, assume user is not authenticated
            throw new Error("Not authenticated");
        }

        const data = await res.json();
        set({ isAuthenticated: true, user: data.user });
        return { isAuthenticated: true, user: data.user }
    },
    login: async (credentials) => {
        if (!credentials.username || !credentials.password) {
            return {success:false, message:"Please fill in all fields"};
        }
        console.log(credentials);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });

            if (!res.ok) return { isAuthenticated: false, user: null }
            
            

            const data = await res.json();
            
            return { isAuthenticated: true, user: data.user }
        } catch (error) {
            set({ isAuthenticated: false, user: null });
            throw error;
        }
    },
    logout: async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("Logout failed");

            set({ isAuthenticated: false, user: null });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    },
    register: async () => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",user,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!res.ok) throw new Error("Registration failed");

            const data = await res.json();
            set({ isAuthenticated: true, user: data.user });
        } catch (error) {
            throw error; // Allows UI to handle the error if needed
        }
    }
}))