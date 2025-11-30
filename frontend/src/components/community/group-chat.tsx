"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Users, ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { communityAPI } from "@/lib/community-api";
import { SupportGroup, SupportGroupMessage } from "@/types/community";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface GroupChatProps {
  group: SupportGroup;
  onBack: () => void;
}

export function GroupChat({ group, onBack }: GroupChatProps) {
  const [messages, setMessages] = useState<SupportGroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getGroupMessages(group.id);
      if (response.data.success) {
        setMessages(response.data.data.messages);
      }
    } catch (error) {
      console.error("gagal memuat pesan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [group.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const response = await communityAPI.sendMessage(group.id, {
        content: newMessage.trim(),
        messageType: "text",
      });
      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data.message]);
        setNewMessage("");
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Card className="rounded-b-none border-b-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="font-semibold text-gray-900">{group.name}</h2>
                <p className="text-sm text-gray-600">
                  {group.memberCount} anggota •{" "}
                  {group.isPublic ? "publik" : "privat"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Belum ada pesan di grup ini</p>
            <p className="text-sm">Jadilah yang pertama menyapa!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.messageType === "system"
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
              {message.messageType === "system" ? (
                <div className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                  {message.content}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs lg:max-w-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {message.user?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(message.createdAt), "HH:mm", {
                        locale: id,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{message.content}</p>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <Card className="rounded-t-none border-t-0">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              placeholder="Ketik pesan dukungan..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
