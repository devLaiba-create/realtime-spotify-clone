import { create } from "zustand";
import type { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,

  initializeQueue: (songs: Song[]) => {
    const currentSong = get().currentSong;
    const currentIndex = currentSong
      ? songs.findIndex((song) => song._id === currentSong._id)
      : -1;

    set({
      queue: songs,
      currentIndex,
    });
  },
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("activity_updated", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },
  setCurrentSong: (song: Song | null) => {
    if (!song) return;
    const songIndex = get().queue.findIndex((s) => s._id === song._id);

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("activity_updated", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    const currentSong = get().currentSong;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("activity_updated", {
        userId: socket.auth.userId,
        activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },
  playNext: () => {
    const { queue, currentIndex } = get();

    const nextIndex = currentIndex + 1;

    // check to see if next song exists
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("activity_updated", {
        userId: socket.auth.userId,
        activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
      });
    }
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      // no next song
      set({ isPlaying: false });
      const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("activity_updated", {
        userId: socket.auth.userId,
        activity: `Idle`,
      });
    }
    }
  },
  playPrevious: () => {
    const { queue, currentIndex } = get();

    const prevIndex = currentIndex - 1;

    // check to see if previous song exists
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
      socket.emit("activity_updated", {
        userId: socket.auth.userId,
        activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
      });
      }
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    }
    else {
      // no previous song
      set({ isPlaying: false });
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
      socket.emit("activity_updated", {
        userId: socket.auth.userId,
        activity: `Idle`,
      });
     }
  };
}}));
