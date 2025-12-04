import { Text } from "./Text";

export default function MessageBubble({
  isSender = true,
  className = "",
  timestamp = "",
  children: content,
}) {
  return (
    <li
      className={
        `${
          isSender
            ? "self-start text-black bg-gray-300"
            : "self-end text-white bg-blue-500"
        } max-w-md px-4 py-2 mb-4 rounded-full` + className
      }
    >
      <Text className="mr-5">{content}</Text>
      <div className="flex items-center justify-end gap-2">
        {timestamp && <Text className="text-xs opacity-70">{timestamp}</Text>}
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
          className="lucide lucide-check-check-icon lucide-check-check size-4"
        >
          <path d="M18 6 7 17l-5-5" />
          <path d="m22 10-7.5 7.5L13 16" />
        </svg>
      </div>
    </li>
  );
}
