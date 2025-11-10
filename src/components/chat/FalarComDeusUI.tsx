"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, BrainCircuit, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

interface FalarComDeusUIProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const FalarComDeusUI = ({ messages, onSendMessage, isLoading }: FalarComDeusUIProps) => {
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('div');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-card rounded-lg border">
      <div className="p-4 border-b text-center">
        <h1 className="text-2xl font-bold uppercase text-yellow-500 tracking-wider">
          Falar com Deus
        </h1>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-yellow-500/20 text-yellow-600">
                    <BrainCircuit className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-md rounded-lg p-3 whitespace-pre-wrap",
                  message.sender === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-yellow-500/20 text-yellow-600">
                  <BrainCircuit className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-md rounded-lg p-3 bg-muted flex items-center space-x-2">
                <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "Aguarde a resposta..." : "Pergunte qualquer coisa sobre seu negócio..."}
            autoComplete="off"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};