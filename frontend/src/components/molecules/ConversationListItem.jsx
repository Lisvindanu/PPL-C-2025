import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import { Text } from "../atoms/Text";

// NOTE: Ini hanya untuk sementara sebelum dihubungkan dengan backend
export default function ConversationListItem(userData) {
  return (
    <Button
      variant="neutral"
      className="w-full rounded-none flex items-center gap-2"
    >
      <Avatar
        src={userData.img || "https://placehold.co/200"}
        alt={userData.name || "avatar"}
        size="lg"
      />
      <div className="flex flex-col">
        <Text variant="h2">{userData.name || "Unknown"}</Text>
        <span className="text-sm text-slate-500">{userData.title || ""}</span>
      </div>
    </Button>
  );
}
