import { Check, CheckCheck } from "lucide-react";

interface MessageReadStatusProps {
    isMine: boolean;
    isRead: boolean;
}

export function MessageReadStatus({ isMine, isRead }: MessageReadStatusProps) {
    if (!isMine) return null;

    return (
        <span className="inline-flex items-center ml-1">
            {isRead ? (
                <CheckCheck className="w-4 h-4 text-blue-500" />
            ) : (
                <Check className="w-4 h-4 text-gray-400" />
            )}
        </span>
    );
}
