import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import MessageBubble from "../atoms/MessageBubble";
import { Text } from "../atoms/Text";

const messageDummy = [
  {
    isSender: true,
    timestamp: "2025-10-03 10:00",
    content: "Hello! How are you?",
  },
  {
    isSender: false,
    timestamp: "2025-10-03 10:01",
    content: "I'm good, thanks! How about you?",
  },
  {
    isSender: true,
    timestamp: "2025-12-03 10:02",
    content: "Doing well, thank you!",
  },
  {
    isSender: false,
    timestamp: "2025-12-03 10:03",
    content: "Great to hear!",
  },
  {
    isSender: true,
    timestamp: "2025-12-04 10:04",
    content: "What are your plans for today?",
  },
  {
    isSender: false,
    timestamp: "2025-12-04 10:05",
    content: "Just working on some projects. You?",
  },
];

export default function MessageBox(userData) {
  const getDateLabel = (timestamp) => {
    const [dateString] = timestamp.split(" ");
    const messageDate = new Date(dateString + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.getTime() === today.getTime()) {
      return "Hari ini";
    }

    if (messageDate.getTime() === yesterday.getTime()) {
      return "Kemarin";
    }

    return messageDate.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedMessages = messageDummy.reduce((acc, message) => {
    const [messageDate] = message.timestamp.split(" ");
    const lastGroup = acc[acc.length - 1];
    if (lastGroup && lastGroup.date === messageDate) {
      lastGroup.messages.push(message);
    } else {
      acc.push({ date: messageDate, messages: [message] });
    }
    return acc;
  }, []);

  return (
    <div className="relative flex flex-col w-full h-full bg-gray-200">
      <div className="flex items-center w-full gap-2 px-4 py-6 rounded-none bg-primary-500/30">
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
          <span className="mt-5 text-green-700">Online</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 pb-20 overflow-y-auto">
        <div className="px-4 pt-2">
          {groupedMessages.map((group, groupIndex) => (
            <ul key={groupIndex} className="flex flex-col">
              <li className="self-center">
                <Text className="mx-auto my-4 text-sm text-gray-500">
                  {getDateLabel(group.messages[0].timestamp)}
                </Text>
              </li>
              {group.messages.map((message, messageIndex) => (
                <MessageBubble
                  key={messageIndex}
                  isSender={message.isSender}
                  timestamp={message.timestamp.split(" ")[1]}
                >
                  {message.content}
                </MessageBubble>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <form className="absolute bottom-0 w-full px-2 pb-2">
        <textarea
          type="text"
          className="w-full py-2 pl-4 pr-12 rounded-full shadow-md resize-none bg-skill-primary focus:outline-none"
          placeholder="Type your message..."
        />
        <Button
          className="-translate-y-2/3 rounded-full top-1/2 right-4 !p-0 absolute bg-transparent"
          type="submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 24"
            className="text-black size-7"
          >
            <path
              fill="currentColor"
              d="M10.548 14.72a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06l-3.25-3.25a.75.75 0 0 0-1.06 1.06l2.72 2.72z"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M12.328 2c-5.523 0-10 4.477-10 10s4.477 10 10 10s10-4.477 10-10s-4.477-10-10-10m-8.5 10a8.5 8.5 0 1 1 17 0a8.5 8.5 0 0 1-17 0"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>
      </form>
    </div>
  );
}
