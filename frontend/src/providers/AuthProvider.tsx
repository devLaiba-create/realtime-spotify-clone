import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import {Loader} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const AuthProvider = ({children}: {children: React.ReactNode}) => {

  const {getToken, isLoaded, userId} = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const {initSocket, disconnectSocket} = useChatStore();

  const updateApiToken = (token:string | null) => {
    if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axiosInstance.defaults.headers.common["Authorization"]
  }


  useEffect(() => {
    if (!isLoaded) return;
    const initAuth = async () => {
      try {
      const token = await getToken();
      updateApiToken(token);  
      if (token) {
        await checkAdminStatus();
        //init socket
        if (userId) initSocket(userId);
      }     
      } catch (error:any) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();

    // clean up
    return () => disconnectSocket();
  }, [getToken, isLoaded, userId, checkAdminStatus, disconnectSocket, initSocket]);

  if (loading) return (
    <div className="h-screen w-full flex justify-center items-center">
      <Loader className="size-8 text-emerald-500 animate-spin"/>
    </div>
  )

  return (
    <div>
      {children}
    </div>
  )
}

export default AuthProvider;
