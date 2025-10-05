
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getConversationById, getTalentById, markConversationAsRead, addMessageToConversation, USERS } from '../../data/mockData';
import { Message, User } from '../../types';


const ImageViewerModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]" onClick={onClose}>
        <div className="relative max-w-full max-h-full p-4">
            <img src={imageUrl} alt="Profile" className="object-contain max-w-full max-h-[90vh] rounded-lg" />
            <button onClick={onClose} className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <i className="fas fa-times"></i>
            </button>
        </div>
    </div>
);

const getVerificationIcon = (userOrTalent: { verificationTier?: 'gold' | 'blue', isPremium?: boolean }) => {
    if (userOrTalent.isPremium) {
        return <i className={`fas fa-gem text-yellow-500 ml-2`} title="Premium Subscriber"></i>;
    }
    if (userOrTalent.verificationTier) {
        const color = userOrTalent.verificationTier === 'gold' ? 'text-yellow-400' : 'text-blue-500';
        return <i className={`fas fa-check-circle ${color} ml-2`} title="Verified"></i>;
    }
    return null;
};


const ChatView: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const conversation = getConversationById(chatId);
    const talent = getTalentById(conversation?.talentId);
    const user = USERS.find(u => u.talentId === talent?.id);
    
    const [messages, setMessages] = useState<Message[]>(conversation?.messages || []);
    const [newMessage, setNewMessage] = useState('');
    const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    useEffect(() => {
        markConversationAsRead(chatId);
    }, [chatId]);
    
    useEffect(scrollToBottom, [messages]);

    if (!conversation || !talent) {
        return <div className="p-6 text-center">Chat not found.</div>;
    }

    const handleSend = () => {
        if (newMessage.trim() === '' || !conversation) return;
        
        // Update global state and move conversation to top
        addMessageToConversation(conversation.id, newMessage.trim());

        // The conversation object is now mutated by the mock data function.
        // Update local state from this mutated object to re-render immediately.
        setMessages([...conversation.messages]);
        setNewMessage('');
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-black relative">
            {/* Chat Header */}
            <div className="flex items-center p-3 pt-12 border-b border-gray-200 dark:border-gray-800 shrink-0 h-28">
                <button onClick={() => navigate(-1)} className="text-xl w-10 text-center shrink-0">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div className="flex items-center min-w-0 flex-grow">
                     <button onClick={() => setViewerImageUrl(talent.profileImage)} className="shrink-0">
                        <img src={talent.profileImage} alt={talent.name} className="w-10 h-10 rounded-full mr-3" />
                    </button>
                    <Link to={`/talent/${talent.id}`} className="flex-grow min-w-0">
                        <h2 className="font-bold text-lg flex items-center truncate">
                            <span className="truncate">{talent.name}</span>
                            {getVerificationIcon({ ...talent, isPremium: user?.isPremium })}
                        </h2>
                    </Link>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl ${msg.senderId === 'me' 
                            ? 'bg-[var(--accent-color)] text-white rounded-br-none' 
                            : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'}`
                        }>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-black">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-3 px-5 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    />
                    <button onClick={handleSend} className="border-2 border-[var(--accent-color)] text-[var(--accent-color)] w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-[var(--accent-color)] hover:text-white transition-colors flex-shrink-0">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            {viewerImageUrl && <ImageViewerModal imageUrl={viewerImageUrl} onClose={() => setViewerImageUrl(null)} />}
        </div>
    );
};

export default ChatView;