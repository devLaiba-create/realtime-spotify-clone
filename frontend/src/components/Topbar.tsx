import { Show, UserButton } from "@clerk/react"
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";

import SignInOAuthButtons  from "./SignInOAuthButtons"
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const TopBar = () => {
  console.log("TopBar rendered")
  const { isAdmin } = useAuthStore();
  console.log({ isAdmin })
  return (
    <div className="flex justify-between items-center p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <img src="/spotify.png" className="size-8" alt="Spotify Logo" />
        Spotify
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to={"/admin"} className={cn(buttonVariants({variant: "outline"}))}>
            <LayoutDashboardIcon className="size-4 mr-2"/>
            Admin Dashboard
          </Link>
        )}
        
       <UserButton />

        <Show when={"signed-out"}>
          <SignInOAuthButtons />
        </Show>
      </div>
    </div>
  )
}

export default TopBar
