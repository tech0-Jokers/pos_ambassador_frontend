interface Message {
  date: string;
  sender: string;
  receiver: string;
  text: string;
}

interface MessageListProps {
  data: Message[];
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ data, className }) => {
  return (
    <div className={`p-4 bg-white shadow rounded-md ${className}`}>
      <h2 className="text-lg font-bold text-center mb-4">新着メッセージ</h2>
      <ul className="space-y-2">
        {data.map((message, index) => (
          <li key={index} className="border-b pb-2">
            <p className="text-sm text-gray-500">{message.date}</p>
            <p className="text-base">
              To:{message.receiver}　　{message.text}　　by{message.sender}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
