"use client";

import { useState } from "react";
import axios from "axios";
import { FalarComDeusUI, Message } from "@/components/chat/FalarComDeusUI";
import { v4 as uuidv4 } from 'uuid';
import { showError } from "@/utils/toast";

const FalarComDeus = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      text: "Olá! Sou 'Deus', seu consultor especialista em gestão de autopeças. Como posso ajudá-lo a otimizar seu negócio hoje?",
      sender: 'ai',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
    };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "SUA_CHAVE_API_AQUI") {
        throw new Error("A chave da API do Gemini não está configurada no arquivo .env.local.");
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
      
      const history = currentMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      // Remove a última mensagem (a do usuário atual) do histórico para colocá-la na requisição principal
      history.pop(); 

      const response = await axios.post(url, {
        contents: [
          ...history,
          {
            role: 'user',
            parts: [{ text }],
          }
        ],
      });

      const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) {
        throw new Error("A resposta da API não continha texto.");
      }

      const aiResponse: Message = {
        id: uuidv4(),
        text: aiText,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error: any) {
      console.error("Erro ao chamar a API do Gemini:", error);
      const errorMessage = error.message || "Ocorreu um erro ao se comunicar com a IA. Verifique o console para mais detalhes.";
      showError(errorMessage);
      const errorResponse: Message = {
        id: uuidv4(),
        text: `Desculpe, ocorreu um erro: ${errorMessage}`,
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return <FalarComDeusUI messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />;
};

export default FalarComDeus;