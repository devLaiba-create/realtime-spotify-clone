import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Show } from "@clerk/react";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  console.log({ albums });

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                class: "w-full justify-start hover:bg-zinc-800 text-white",
              }),
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <Show when={"signed-in"}>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  class: "w-full justify-start hover:bg-zinc-800 text-white",
                }),
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          </Show>
        </div>
      </div>

      {/* Library section */}
      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="mr-2 size-5" />
            <span className="hidden md:inline ">Playlists</span>
          </div>
        </div>

        <ScrollArea type="always" className="min-h-0 flex-1">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2 flex items-center hover:bg-zinc-800 rounded-md gap-3 group cursor-pointer"
                >
                  <img 
                    src={album.imageUrl}
                    alt="Playlist Image"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">{album.title}</p>
                    <p className="text-sm text-zinc-400 truncate">Album • {album.artist}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
