import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { ChatList } from "@/components/chat/ChatList";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false },
};

export default function ChatPage() {
  return (
    <AppFrame>
      <ChatList />
    </AppFrame>
  );
}
