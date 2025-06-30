import {create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

// for managing global variables
export const useAuthStore = create((set) =>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async() => {
        try{
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data})
        } catch(error){
            console.log("Error in checkAuth: ", error)
            set({authUser: null});
        } finally{
            set({ isCheckingAuth: false});
        }
        
    }, 

    signup: async (data)=> {
        set({ isSigningUp: true});
        try{
            const res=axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data});
            toast.success("Account created successfully");
            
        } catch(error){
            console.log("Error in signup function");
            toast.error(error.response.data.message);
        } finally{
            set({ isSigningUp: false});
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
    logout: async () => {
       try {await axiosInstance("/auth/logout");
        set({ authUser: null });
        toast.success( "Logged out successfully");
    } catch(error){
        console.log("Error in logout function");
        toast.error(error.response.data.message);
    }
    }, 
    
    // const updateProfile
}))