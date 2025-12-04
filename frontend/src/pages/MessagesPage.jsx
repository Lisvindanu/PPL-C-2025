import MessageBox from "../components/molecules/MessageBox";
import ConversationList from "../components/organisms/ConversationList";
import Navbar from "../components/organisms/Navbar";

export default function MessagesPage() {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex w-full min-h-0 gap-1 p-5">
        <aside className="min-h-0 w-96">
          <ConversationList />
        </aside>

        <MessageBox />
      </div>
    </div>
  );
}
