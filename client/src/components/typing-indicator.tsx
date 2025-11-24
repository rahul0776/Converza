import { motion } from "framer-motion";

interface TypingUser {
    userId: string;
    userName: string;
}

export function TypingIndicator({ typingUsers }: { typingUsers: TypingUser[] }) {
    if (typingUsers.length === 0) return null;

    const getTypingText = () => {
        if (typingUsers.length === 1) {
            return `${typingUsers[0].userName} is typing`;
        } else if (typingUsers.length === 2) {
            return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing`;
        } else {
            return `${typingUsers.length} people are typing`;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#6B6B6B]"
        >
            <div className="flex gap-1">
                <motion.span
                    className="w-2 h-2 bg-[#FF8C42] rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.span
                    className="w-2 h-2 bg-[#FF8C42] rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                    }}
                />
                <motion.span
                    className="w-2 h-2 bg-[#FF8C42] rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4
                    }}
                />
            </div>
            <span>{getTypingText()}...</span>
        </motion.div>
    );
}
