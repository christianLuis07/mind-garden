export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  isMember?: boolean;
  userRole?: "member" | "moderator" | "admin";
}

export interface SupportGroupMember {
  id: string;
  userId: string;
  supportGroupId: string;
  role: "member" | "moderator" | "admin";
  joinedAt: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface SupportGroupMessage {
  id: string;
  content: string;
  userId: string;
  supportGroupId: string;
  messageType: "text" | "image" | "system";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface CreateSupportGroupData {
  name: string;
  description: string;
  isPublic: boolean;
  maxMembers?: number;
}

export interface SendMessageData {
  content: string;
  messageType?: "text" | "image";
  imageUrl?: string;
}
