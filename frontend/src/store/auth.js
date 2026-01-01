import {create} from "zustand"
import {persist} from "zustand/middleware"

export const useAuthStore = create(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            checkAuthStatus: async () => {
                try {
                    const res = await fetch("/api/auth/check", {
                        method: "GET",
                        credentials: "include", // This ensures cookies (like session cookies) are sent with the request
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    const data = await res.json();
                    
                    if (data.authenticated && data.user) {
                        set({ isAuthenticated: true, user: data.user });
                        return { isAuthenticated: true, user: data.user };
                    } else {
                        // User is not authenticated (401 response)
                        set({ isAuthenticated: false, user: null });
                        return { isAuthenticated: false, user: null };
                    }
                } catch (error) {
                    // On network error, don't clear the persisted state
                    // The persist middleware will keep the last known state
                    console.error("Auth check failed:", error);
                    // Don't update state on network errors - let persisted state remain
                    return null;
                }
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
                    
                    set({ isAuthenticated: true, user: data.user });
                    return { isAuthenticated: true, user: data.user };
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
            register: async (userData) => {
                if (!userData.name || !userData.username || !userData.email || !userData.password) {
                    return { success: false, message: "Please fill in all required fields" };
                }
                try {
                    const res = await fetch("/api/auth/register", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(userData)
                    });

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.message || "Registration failed");
                    }

                    const data = await res.json();
                    return { success: true, user: data.user };
                } catch (error) {
                    throw error; // Allows UI to handle the error if needed
                }
            }
            }),
        {
            name: "auth-storage", // localStorage key
        }
    )
)
