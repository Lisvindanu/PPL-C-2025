import Avatar from "../atoms/Avatar";
import { Text } from "../atoms/Text";

// NOTE: Ini hanya untuk sementara sebelum dihubungkan dengan backend
export default function MessageBox(userData) {
  return (
    <div className="bg-gray-200 flex flex-col h-full w-full">
      <div className="w-full px-4 py-6 rounded-none flex items-center gap-2 bg-primary-500/30">
        <Avatar
          src={userData.img || "https://placehold.co/200"}
          alt={userData.name || "avatar"}
          size="lg"
        />
        <div className="flex flex-col">
          <Text variant="h2">{userData.name || "Unknown"}</Text>
          <span className="text-sm text-slate-500">
            {userData.title || "Designer Graphic"}
          </span>
          <span className="text-green-700 mt-5">Online</span>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto flex-1">
        <div className="flex flex-col px-4 pt-2">
          {
            /* Message bubbles will go here */
            [...Array(20)].map((_, index) =>
              index % 2 === 0 ? (
                <div
                  key={index}
                  className="rounded-full px-4 py-2 bg-gray-300 text-black max-w-md mb-4 self-end"
                >
                  <Text className="mr-5">This is a sample reply message.</Text>
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
                    className="lucide lucide-check-check-icon lucide-check-check ms-auto"
                  >
                    <path d="M18 6 7 17l-5-5" />
                    <path d="m22 10-7.5 7.5L13 16" />
                  </svg>
                </div>
              ) : (
                <div
                  key={index}
                  className="rounded-full px-4 py-2 bg-blue-500 text-white max-w-md mb-4"
                >
                  <Text className="mr-5">
                    This is a sample message from the user.
                  </Text>
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
                    className="lucide lucide-check-check-icon lucide-check-check ms-auto"
                  >
                    <path d="M18 6 7 17l-5-5" />
                    <path d="m22 10-7.5 7.5L13 16" />
                  </svg>
                </div>
              ),
            )
          }
        </div>
      </div>
    </div>
  );
}
