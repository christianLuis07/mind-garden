import { api } from "./api";
import {
  SupportGroup,
  SupportGroupMember,
  SupportGroupMessage,
  CreateSupportGroupData,
  SendMessageData,
} from "@/types/community";

export const communityAPI = {
  // ambil semua support group
  getSupportGroups: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isPublic?: boolean;
  }) =>
    api.get<{
      success: boolean;
      data: {
        groups: SupportGroup[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>("/community/groups", { params }),

  // ambil single support group
  getSupportGroup: (groupId: string) =>
    api.get<{
      success: boolean;
      data: { group: SupportGroup };
    }>(`/community/groups/${groupId}`),

  createSupportGroup: (data: CreateSupportGroupData) =>
    api.post<{
      success: boolean;
      message: string;
      data: { group: SupportGroup };
    }>("/community/groups", data),

  // join support group
  joinSupportGroup: (groupId: string) =>
    api.post<{
      success: boolean;
      message: string;
    }>(`/community/groups/${groupId}/join`),

  // ambil group members
  getGroupMembers: (
    groupId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ) =>
    api.get<{
      success: boolean;
      data: {
        members: SupportGroupMember[];
      };
    }>(`/community/groups/${groupId}/members`, { params }),

  // ambil pesan group
  getGroupMessages: (
    groupId: string,
    params?: {
      page?: number;
      limit?: number;
      before?: string;
    }
  ) =>
    api.get<{
      success: boolean;
      data: {
        messages: SupportGroupMessage[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(`/community/groups/${groupId}/messages`, { params }),

  // invite user
  inviteUser: (groupId: string, email: string) =>
    api.post<{ success: boolean; message: string }>(
      `/community/groups/${groupId}/invite`,
      { email }
    ),

  // kirim pesan
  sendMessage: (groupId: string, data: SendMessageData) =>
    api.post<{
      success: boolean;
      message: string;
      data: { message: SupportGroupMessage };
    }>(`/community/groups/${groupId}/messages`, data),

  // kirim pesan gambar
  sendImageMessage: (groupId: string, formData: FormData) =>
    api.post<{
      success: boolean;
      message: string;
      data: { message: SupportGroupMessage };
    }>(`/community/groups/${groupId}/messages/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteMessage: (groupId: string, messageId: string) =>
    api.delete<{ success: boolean; message: string }>(
      `/community/groups/${groupId}/messages/${messageId}`
    ),

  // promote admin
  promoteMember: (groupId: string, userId: string) =>
    api.post<{ success: boolean; message: string }>(
      `/community/groups/${groupId}/members/promote`,
      { userId }
    ),

  // kick member
  removeMember: (groupId: string, userId: string) =>
    api.delete<{ success: boolean; message: string }>(
      `/community/groups/${groupId}/members/${userId}`
    ),

  // keluar groups
  leaveSupportGroup: (groupId: string) =>
    api.post<{ success: boolean; message: string }>(
      `/community/groups/${groupId}/leave`
    ),
};
