"use client";

import { useState, useEffect, useRef } from "react";
import {
  SendHorizontal,
  Users,
  ArrowLeft,
  Lock,
  UserPlus,
  X,
  Check,
  CheckCheck,
  MoreVertical,
  ImagePlus,
  Info,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { communityAPI } from "@/lib/community-api";
import { SupportGroup, SupportGroupMessage } from "@/types/community";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { GroupInfo } from "./group-info";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
      : "http://localhost:5000";

    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current.emit("join_group", group.id);

    socketRef.current.on("receive_message", (incomingMessage: SupportGroupMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === incomingMessage.id)) return prev;
        return [...prev, incomingMessage];
      });
      scrollToBottom();
    });

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
      console.error("Gagal memuat data chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [group.id]);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5242880) { toast.error("Maksimal 5MB"); return; }
      if (!file.type.startsWith("image/")) { toast.error("Format tidak didukung"); return; }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const cancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;
    try {
      setSending(true);
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const response = await communityAPI.sendImageMessage(group.id, formData);
        if (response.data.success) {
          cancelImage();
          const savedMessage = response.data.data.message;
          setMessages((prev) => prev.some((m) => m.id === savedMessage.id) ? prev : [...prev, savedMessage]);
        }
      } else {
        const contentToSend = newMessage.trim();
        setNewMessage("");
        const response = await communityAPI.sendMessage(group.id, { content: contentToSend, messageType: "text" });
        if (response.data.success) {
          const savedMessage = response.data.data.message;
          setMessages((prev) => prev.some((m) => m.id === savedMessage.id) ? prev : [...prev, savedMessage]);
        }
      }
    } catch (e) {
      toast.error("Gagal mengirim");
      if (!selectedImage) setNewMessage(newMessage);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleJoinGroup = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.joinSupportGroup(group.id);
      if (response.data.success) {
        toast.success("Berhasil bergabung!");
        setIsMember(true);
        fetchData();
      }
    } catch (e) { toast.error("Gagal bergabung"); } finally { setLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-full bg-muted/20 rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl relative">
      {/* Dynamic Background Patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#7A9A7E 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

      {/* Chat Header */}
      <div className="z-20 bg-card/60 backdrop-blur-xl border-b border-border/40 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={onBack} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => isMember && setShowInfo(true)}>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10 group-hover:rotate-6 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-foreground text-base flex items-center gap-2">
                  {group.name}
                  {!group.isPublic && <Lock className="w-3 h-3 text-muted-foreground/50" />}
                </h2>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                     {group.isPublic ? "Ruang Publik" : "Ruang Privat"}
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMember && (
              <Button variant="ghost" size="icon" onClick={() => setShowInfo(true)} className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Info className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10 custom-scrollbar">
        {messages.map((message, idx) => {
          const isMine = message.userId === currentUserId || message.user?.id === currentUserId;
          const isSystem = message.messageType === "system";

          if (isSystem) {
            return (
              <div key={message.id} className="flex justify-center my-6">
                <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/10 shadow-sm">
                  {message.content}
                </span>
              </div>
            );
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={message.id}
              className={cn("flex flex-col", isMine ? "items-end" : "items-start")}
            >
              <div className={cn(
                "max-w-[85%] md:max-w-[70%] rounded-[2rem] p-4 md:p-6 shadow-xl relative transition-all duration-300",
                isMine 
                  ? "bg-primary text-white rounded-tr-none shadow-primary/10" 
                  : "bg-card text-foreground rounded-tl-none shadow-black/5"
              )}>
                {!isMine && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                    {message.user?.name || "Teman Cerita"}
                  </p>
                )}

                {message.messageType === "image" && message.imageUrl ? (
                  <div className="mb-2 overflow-hidden rounded-2xl border border-white/10 shadow-inner">
                    <img src={message.imageUrl} alt="Shared" className="w-full h-auto max-h-80 object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
                  </div>
                ) : (
                  <p className="text-sm md:text-base leading-relaxed font-medium">
                    {message.content}
                  </p>
                )}

                <div className={cn(
                  "flex items-center gap-1.5 mt-2 opacity-60 text-[10px] font-bold uppercase",
                  isMine ? "justify-end text-white" : "justify-start text-muted-foreground"
                )}>
                  <span>{format(new Date(message.createdAt), "HH:mm")}</span>
                  {isMine && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-8 bg-card/40 backdrop-blur-xl border-t border-border/40 z-20">
        {isMember ? (
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {imagePreview && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="relative inline-block ml-16">
                  <div className="h-28 w-28 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button onClick={cancelImage} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 shrink-0 rounded-full bg-card shadow-lg border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all"
              >
                <ImagePlus className="w-6 h-6" />
              </button>
              
              <div className="flex-1 relative group">
                <Input
                  ref={inputRef}
                  placeholder={selectedImage ? "Gambar terpilih..." : "Ketik pesan di sini..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                  className="h-14 px-8 bg-card/80 border-none rounded-full shadow-lg focus:ring-2 focus:ring-primary/20 transition-all italic text-base"
                />
              </div>

              <button
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !selectedImage) || sending}
                className={cn(
                  "w-14 h-14 shrink-0 rounded-full flex items-center justify-center shadow-xl transition-all",
                  (newMessage.trim() || selectedImage) ? "bg-primary text-white scale-110" : "bg-muted text-muted-foreground"
                )}
              >
                {sending ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <SendHorizontal className="w-6 h-6 ml-1" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto py-4">
             <div className="glass-card p-6 rounded-[2rem] border-none shadow-xl text-center space-y-4">
                <ShieldCheck className="w-10 h-10 text-primary mx-auto opacity-40" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Akses Ruang Terbatas</p>
                <Button onClick={handleJoinGroup} className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20">
                   Gabung ke Ruang Ini
                </Button>
             </div>
          </div>
        )}
      </div>

      {showInfo && <GroupInfo group={group} onClose={() => setShowInfo(false)} onLeaveGroup={() => { setShowInfo(false); onBack(); }} />}
    </div>
  );
}
