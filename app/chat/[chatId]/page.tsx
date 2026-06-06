import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { ChatThread } from "@/components/chat/ChatThread";

export const metadata: Metadata = {
  title: "Chat",
  robots: { index: false },
};

export default function ChatThreadPage({ params }: { params: { chatId: string } }) {
  return (
    <AppFrame showFooter={false}>
      <ChatThread chatId={params.chatId} />
    </AppFrame>
  );
}
