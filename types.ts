
export enum UserRole {
  Talent = "Talent",
  Client = "Client",
}

export interface Talent {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  reviewsCount: number;
  distance: number;
  hustles: string[];
  skills: string[];
  bio: string;
  portfolio: { type: 'image' | 'video'; url: string; thumbnail?: string }[];
  reviews: { reviewer: string; rating: number; comment: string }[];
  verificationTier?: 'gold' | 'blue';
}

export interface Comment {
  id: string;
  user: string;
  userId: string;
  profileImage: string;
  text: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  talentId: string;
  text: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  music?: string;
  comments: Comment[];
}

export interface Reel {
  id: string;
  talentId: string;
  videoUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  music: {
    title: string;
    artist: string;
  };
  comments: Comment[];
}

export interface Message {
  id:string;
  senderId: 'me' | string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  talentId: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTimestamp: string;
  lastMessageDate: Date;
  unreadCount: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  username: string;
  profileImage: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  talentId?: string;
  profession?: string;
  verificationTier?: 'gold' | 'blue';
  phoneNumber?: string;
  isPremium?: boolean;
  subscriptionEndDate?: string; 
}

export interface LoginSession {
    id: string;
    device: string;
    location: string;
    loginTime: string;
    isCurrent: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  talentName: string;
  talentProfileImage: string;
}

export type ThemeAccent = 'blue' | 'green' | 'pink' | 'orange';

export interface Job {
  id: string;
  title: string;
  clientId: string;
  location: string;
  budget: number;
  description: string;
  requiredProfession: string; // e.g., 'DJ', 'Photographer'
}
