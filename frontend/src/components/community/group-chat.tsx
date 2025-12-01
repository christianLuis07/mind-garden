"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Users,
  ArrowLeft,
  Lock,
  UserPlus,
  X,
  Check,
  MoreVertical,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { communityAPI } from "@/lib/community-api";
import { SupportGroup, SupportGroupMessage } from "@/types/community";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { GroupInfo } from "./group-info";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
// [BARU] Import Socket Client
import { io, Socket } from "socket.io-client";

interface GroupChatProps {
  group: SupportGroup;
  onBack: () => void;
}

export function GroupChat({ group, onBack }: GroupChatProps) {
  const { user } = useAuthStore();
  const currentUserId = user?.id;

  const [messages, setMessages] = useState<SupportGroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [isMember, setIsMember] = useState(false);
  const [hasPendingInvite, setHasPendingInvite] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const [showInfo, setShowInfo] = useState(false);

  // [BARU] Ref untuk menyimpan koneksi socket
  const socketRef = useRef<Socket | null>(null);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelfLeft = () => {
    onBack();
  };

  // [BARU] Setup Socket.io
  useEffect(() => {
    // Ganti URL ini sesuai dengan URL backend-mu.
    // Jika backend berjalan di port 5000:
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "") // Hapus suffix API jika ada
      : "http://localhost:5000";

    // 1. Inisialisasi Socket
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true, // Penting untuk CORS session/cookies
      transports: ["websocket", "polling"],
    });

    // 2. Join Group Room
    socketRef.current.emit("join_group", group.id);

    // 3. Listen Pesan Masuk (Realtime)
    socketRef.current.on(
      "receive_message",
      (incomingMessage: SupportGroupMessage) => {
        // Update state messages dengan pengecekan duplikasi
        setMessages((prev) => {
          // Cek apakah pesan dengan ID ini sudah ada? (Mencegah pesan ganda dari API response + Socket)
          if (prev.some((msg) => msg.id === incomingMessage.id)) {
            return prev;
          }
          return [...prev, incomingMessage];
        });

        // Auto scroll ke bawah
        scrollToBottom();
      }
    );

    // Cleanup saat user keluar halaman / ganti grup
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_group", group.id);
        socketRef.current.disconnect();
      }
    };
  }, [group.id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const groupRes = await communityAPI.getSupportGroup(group.id);
      if (groupRes.data.success) {
        const groupData: any = groupRes.data.data;
        const targetGroup = groupData.supportGroup || groupData.group;

        if (targetGroup) {
          setIsMember(!!targetGroup.isMember);
          setHasPendingInvite(!!targetGroup.hasPendingInvite);
        }
      }

      const msgRes = await communityAPI.getGroupMessages(group.id);
      if (msgRes.data.success) {
        setMessages(msgRes.data.data.messages);
      }
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [group.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // Tambahkan sedikit delay untuk memastikan DOM render
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);

      // [OPTIMISASI] Kosongkan input segera agar terasa responsif
      const contentToSend = newMessage.trim();
      setNewMessage("");

      const response = await communityAPI.sendMessage(group.id, {
        content: contentToSend,
        messageType: "text",
      });

      if (response.data.success) {
        const savedMessage = response.data.data.message;

        // Tambahkan ke list HANYA JIKA socket belum menambahkannya
        setMessages((prev) => {
          if (prev.some((m) => m.id === savedMessage.id)) return prev;
          return [...prev, savedMessage];
        });

        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      toast.error("Gagal mengirim pesan");
      // Kembalikan teks jika gagal
      setNewMessage(newMessage);
    } finally {
      setSending(false);
    }
  };

  const handleJoinGroup = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.joinSupportGroup(group.id);
      if (response.data.success) {
        toast.success("Berhasil bergabung!");
        setIsMember(true);
        setHasPendingInvite(false);
        fetchData();
      }
    } catch (error: any) {
      if (error.response?.data?.message?.includes("sudah menjadi anggota")) {
        setIsMember(true);
      } else {
        toast.error(error.response?.data?.message || "Gagal bergabung");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;
    try {
      setInviting(true);
      await communityAPI.inviteUser(group.id, inviteEmail);
      toast.success("Undangan dikirim");
      setInviteEmail("");
      setShowInviteForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengirim undangan");
    } finally {
      setInviting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#efeae2] relative overflow-hidden">
      {/* Header */}
      <Card className="rounded-none border-b shadow-sm z-20 bg-white">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="rounded-full shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div
                className="flex items-center gap-3 overflow-hidden cursor-pointer hover:bg-gray-50 p-1 pr-4 rounded-lg transition-colors flex-1"
                onClick={() => isMember && setShowInfo(true)}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="truncate">
                  <h2 className="font-semibold text-gray-900 leading-tight flex items-center gap-2 truncate text-sm sm:text-base">
                    {group.name}
                    {!group.isPublic && (
                      <Lock className="w-3 h-3 text-gray-400 shrink-0" />
                    )}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">
                    {isMember
                      ? "Ketuk untuk info grup"
                      : group.isPublic
                      ? "Grup Publik"
                      : "Grup Privat"}
                  </p>
                </div>
              </div>

              {showInviteForm ? (
                <div className="flex items-center gap-2 animate-in fade-in flex-1">
                  <Input
                    placeholder="Email teman..."
                    className="h-9 text-sm"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    autoFocus
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9 bg-green-600 shrink-0"
                    onClick={handleInviteUser}
                    disabled={inviting}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0"
                    onClick={() => setShowInviteForm(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Placeholder */}
                </div>
              )}
            </div>

            <div className="flex gap-1 shrink-0">
              {isMember && !showInviteForm && !group.isPublic && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInviteForm(true)}
                >
                  <UserPlus className="w-5 h-5 text-gray-600" />
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* KOLOM CHAT */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#efeae2] relative">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 relative">
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
              }}
            ></div>

            {messages.map((message) => {
              const isMine =
                message.userId === currentUserId ||
                message.user?.id === currentUserId;
              const isSystem = message.messageType === "system";

              if (isSystem) {
                return (
                  <div
                    key={message.id}
                    className="flex justify-center my-4 relative z-10"
                  >
                    <span className="bg-[#e6f2fb] text-gray-600 text-[10px] sm:text-xs px-3 py-1 rounded-lg shadow-sm uppercase font-medium tracking-wide border border-blue-100">
                      {message.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className={`flex relative z-10 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                        relative max-w-[80%] sm:max-w-[65%] px-3 py-2 text-sm shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]
                        ${
                          isMine
                            ? "bg-[#d9fdd3] rounded-lg rounded-tr-none text-gray-900"
                            : "bg-white rounded-lg rounded-tl-none text-gray-900"
                        }
                        `}
                  >
                    {!isMine && (
                      <p className="text-[11px] font-bold text-orange-600 mb-0.5 leading-none">
                        {message.user?.name || "Member"}
                      </p>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap wrap-break-word text-sm">
                      {message.content}
                    </p>

                    <div
                      className={`text-[10px] mt-1 flex items-center gap-1 ${
                        isMine
                          ? "justify-end text-green-800/60"
                          : "justify-end text-gray-400"
                      }`}
                    >
                      <span>
                        {format(new Date(message.createdAt), "HH:mm", {
                          locale: id,
                        })}
                      </span>
                      {isMine && <Check className="w-3 h-3" />}
                    </div>

                    <div
                      className={`absolute top-0 w-0 h-0 border-[6px] border-transparent 
                        ${
                          isMine
                            ? "-right-1.5 border-t-[#d9fdd3] border-l-[#d9fdd3]"
                            : "-left-1.5 border-t-white border-r-white"
                        }`}
                    />
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 sm:p-3 bg-[#f0f2f5] z-20 sticky bottom-0">
            {isMember ? (
              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex-1 bg-white rounded-2xl flex items-center px-4 py-2 shadow-sm border border-gray-100 min-h-11">
                  <Input
                    ref={inputRef}
                    placeholder="Ketik pesan..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    className="border-none shadow-none focus-visible:ring-0 p-0 h-auto max-h-32 min-h-6 resize-none bg-transparent text-gray-800 placeholder:text-gray-400"
                    autoComplete="off"
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className={`h-11 w-11 rounded-full shrink-0 shadow-sm transition-all flex items-center justify-center ${
                    newMessage.trim()
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-300"
                  }`}
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm text-center mx-auto max-w-lg">
                {group.isPublic ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">
                      Bergabung untuk berinteraksi di grup ini.
                    </p>
                    <Button
                      onClick={handleJoinGroup}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Gabung Komunitas
                    </Button>
                  </div>
                ) : hasPendingInvite ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">
                      Anda memiliki undangan pending.
                    </p>
                    <Button
                      onClick={handleJoinGroup}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Terima Undangan
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-gray-400 py-1">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">
                      Grup Privat (Memerlukan Undangan)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {showInfo && (
          <GroupInfo
            group={group}
            onClose={() => setShowInfo(false)}
            onLeaveGroup={handleSelfLeft}
          />
        )}
      </div>
    </div>
  );
}
