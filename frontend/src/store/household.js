import {create} from "zustand"
import {persist} from "zustand/middleware"

export const useHouseholdStore = create(
    persist(
        (set, get) => ({
            households: [],
            currentHousehold: null,
            setHouseholds: (households) => set({households}),
            setCurrentHousehold: (household) => set({currentHousehold: household}),
            fetchHousehold: async (householdId) => {
                if (!householdId) {
                    return {success: false, message: "Household ID is required"}
                }
                try {
                    const res = await fetch("/api/household/" + householdId, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include"
                    })
                    if (!res.ok) {
                        throw new Error("Failed to fetch household")
                    }
                    const data = await res.json();
                    set({currentHousehold: data.data})
                    return {success: true, message: "Household fetched successfully", data: data.data}
                } catch (error) {
                    set({currentHousehold: null})
                    return {success: false, message: "Failed to fetch household"}
                }
            },
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
                    console.log("households:", data.data);
                    // Extract households from user object (populated)
                    set({households: data.data.households || []})
                    return {success: true, message: "Households fetched successfully"}
                } catch (error) {
                    set({households: []})
                    return {success: false, message: "Failed to fetch households"}
                }
            },
            createHousehold: async (householdData, userId) => {
                if (!householdData.name || !householdData.description) {
                    return {success: false, message: "Please provide all fields"}
                }
                try {
                    const res = await fetch("/api/household", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify(householdData)
                    })
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}))
                        throw new Error(errorData.message || "Failed to create household")
                    }
                    const data = await res.json();
                    // Refresh the households list after successful creation
                    if (userId) {
                        await get().fetchUserHouseholds(userId)
                    }
                    return {success: true, message: "Household created successfully", data: data.data}
                } catch (error) {
                    return {success: false, message: error.message || "Failed to create household"}
                }
            }
        }),
        {
            name: "household-storage", // localStorage key
        }
    )
)

