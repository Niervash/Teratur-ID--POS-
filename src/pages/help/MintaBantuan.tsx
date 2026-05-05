import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Headphones,
  HelpCircle,
  BookOpen,
  Video,
  Paperclip,
  Smile,
  MoreVertical,
  User,
  Bot,
  Phone,
  Globe,
  Instagram,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MintaBantuan = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Halo! Saya asisten virtual Teratur. Ada yang bisa saya bantu hari ini?",
      time: "09:00",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");

    // Simulasi respons (Karena LLM masih dikembangkan)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "bot",
          text: "Terima kasih atas pertanyaannya. Pesan Anda telah diterima dan akan segera direspon oleh tim CS kami jika asisten virtual tidak dapat menjawab sepenuhnya.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Pusat Bantuan & Support
          </h1>
          <p className="text-muted-foreground">
            Kami siap membantu operasional bisnis Anda 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Support Cards */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="border-border/30 bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Kontak Langsung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      WhatsApp Hotine
                    </p>
                    <p className="text-sm font-bold">0851-2233-7703</p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-4 p-3 rounded-xl bg-accent/5 border border-accent/10">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-blue">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Email Support
                    </p>
                    <p className="text-sm font-bold">help@teratur.id</p>
                  </div>
                </div> */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-accent/5 border border-accent/10">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-purple">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Our Instagram
                    </p>
                    <a>
                      <p className="text-sm font-bold">@teraturid</p>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 rounded-2xl"
              >
                <BookOpen className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold">Dokumentasi</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 rounded-2xl"
              >
                <Video className="w-6 h-6 text-accent" />
                <span className="text-xs font-bold">Tutorial Video</span>
              </Button>
            </div>
          </div>

          {/* Chatbot Interface */}
          <div className="lg:col-span-8">
            <Card className="border-border/30 shadow-2xl overflow-hidden flex flex-col h-[650px] rounded-3xl">
              {/* Chat Header */}
              <div className="p-4 border-b border-border/30 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <Headphones />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">
                        Teratur Virtual Assistant
                      </h4>
                      <Badge
                        variant="success"
                        className="text-[8px] h-3 px-1 uppercase"
                      >
                        AI Powered
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Biasanya membalas dalam hitungan detik
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Chat Body */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-primary/5 scrollbar-thin"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === "user"
                            ? "bg-primary/20 text-primary"
                            : "bg-accent/20 text-accent"
                        }`}
                      >
                        {msg.sender === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.sender === "user"
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-card border border-border/30 rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <p
                          className={`text-[10px] text-muted-foreground ${msg.sender === "user" ? "text-right" : "text-left"}`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-card border-t border-border/30">
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-secondary/30 border border-border/20 focus-within:ring-2 ring-primary/20 transition-all">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Tulis pesan Anda..."
                    className="border-none bg-transparent focus-visible:ring-0 h-8"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MintaBantuan;
