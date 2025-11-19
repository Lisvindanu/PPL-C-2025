import MessageBox from "../components/molecules/MessageBox";
import ConversationList from "../components/organisms/ConversationList";

// NOTE: Ini untuk sementara saja sebelum dihubungkan dengan backend
export default function MessagesPage() {
  // const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
  return (
    <div className="h-screen flex">
      <nav className="flex items-center bg-gray-50 absolute justify-between py-2 px-4 z-50 h-20 inset-x-0 shadow-md">
        <img
          src="/LogoSkillConnect.png"
          alt="logo skill connect"
          className="w-60"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bell-icon lucide-bell"
        >
          <path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>
      </nav>

      <div className="flex p-5 h-full w-full gap-1 pt-24">
        <aside className="w-96 min-h-0">
          <ConversationList />
        </aside>

        <MessageBox />
      </div>
    </div>
  );
}
