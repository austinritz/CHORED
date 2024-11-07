import {create} from "zustand"

export const useChoreStore = create((set) => ({
    chores: [],
    setChores: (chores) => set({chores}),
    createChore: async (newChore) => {
        if(!newChore.name || !newChore.description) {
            return {success:false, message:"Please fill in all fields"}
        }
        const res = await fetch("/api/chore", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(newChore)
        })
        const data = await res.json();
        set((state) => ({chores:[...state.chores, data.data]}))
        return {success:true, message:"Product created successfully"}
    }
}))