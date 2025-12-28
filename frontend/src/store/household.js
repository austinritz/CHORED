import {create} from "zustand"

export const useHouseholdStore = create((set) => ({
    households: [],
    setHouseholds: (households) => set({households}),
    fetchUserHouseholds: async (userId) => {
        if (!userId) {
            return {success: false, message: "User ID is required"}
        }
        try {
            const res = await fetch("/api/user/" + userId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if (!res.ok) {
                throw new Error("Failed to fetch user households")
            }
            const data = await res.json();
            // Extract households from user object (populated)
            set({households: data.data.households || []})
            return {success: true, message: "Households fetched successfully"}
        } catch (error) {
            set({households: []})
            return {success: false, message: "Failed to fetch households"}
        }
    }
}))

