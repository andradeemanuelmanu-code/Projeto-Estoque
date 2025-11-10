import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAi = message.sender === 'ai';

  return (
    <div className={cn("flex items-start gap-4 p-4", isAi ? "justify-start" : "justify-end")}>
      {isAi && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-6 w-6" />
        </div>
      )}
      <div
        className={cn(
          "max-w-md rounded-lg px-4 py-3 text-sm",
          isAi
            ? "bg-muted text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
      {!isAi && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <User className="h-6 w-6" />
        </div>
      )}
    </div>
  );
};