export interface Song {
  _id : string;
  title: string; 
  artist: string; 
  imageUrl: string; 
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  albumId: string | null
}

export interface Album {
  _id : string;
  title: string; 
  artist: string; 
  imageUrl: string;
  releaseYear: string;
  createdAt: Date;
  updatedAt: Date;
  songs: Song[]
}

export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalArtists: number;
  totalUsers: number
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string,
  clerkId: string,
  fullName: string,
  imageUrl: string,
}