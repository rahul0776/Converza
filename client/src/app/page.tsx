import { ChatArea } from "@/components/chat-area";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#FFFBF7] via-[#FFF8F0] to-[#FFE5D0]">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
