import { apiClient } from "./client";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments: string[];
  sentAt: string;
  sender: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface Conversation {
  id: string;
  participants: Array<{
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
  }>;
  lastMessage: {
    content: string;
    sentAt: string;
  } | null;
  unreadCount: number;
}

export interface SendMessageDto {
  recipientIds: string[];
  content: string;
  attachments?: string[];
}

export const messagesApi = {
  sendMessage: (data: SendMessageDto) =>
    apiClient<Message>("/api/v1/messages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getConversations: () =>
    apiClient<Conversation[]>("/api/v1/messages/conversations"),

  getMessages: (conversationId: string, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    return apiClient<{ data: Message[]; total: number; page: number; limit: number }>(
      `/api/v1/messages/messages/${conversationId}?${query.toString()}`
    );
  },
};
