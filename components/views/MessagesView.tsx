
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CONVERSATIONS, getTalentByConversation, USERS } from '../../data/mockData';
import { Conversation, User } from '../../types';

const getVerificationIcon = (userOrTalent: { verificationTier?: 'gold' | 'blue', isPremium?: boolean }) => {
    if (userOrTalent.isPremium) {
        return <i className={`fas fa-gem text-yellow-500 ml-1.5 text-xs`} title="Premium Subscriber"></i>;
    }
    if (userOrTalent.verificationTier) {
        const color = userOrTalent.verificationTier === 'gold' ? 'text-yellow-400' : 'text-blue-500';
        return <i className={`fas fa-check-circle ${color} ml-1.5 text-xs`} title="Verified"></i>;
    }
    return null;
};

const ConversationCard: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
    const talent = getTalentByConversation(conversation);
    const user = USERS.find(u => u.talentId === talent?.id);
    if (!talent) return null;

    return (
        <Link to={`/messages/${conversation.id}`} className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200">
            <img src={talent.profileImage} alt={talent.name} className="w-14 h-14 rounded-full mr-4" />
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <p className={`font-bold truncate ${conversation.unreadCount > 0 ? 'text-black dark:text-white' : ''} flex items-center`}>
                        {talent.name}
                        {getVerificationIcon({ ...talent, isPremium: user?.isPremium })}
                    </p>
                    <p className="text-xs text-gray-500 shrink-0 ml-2">{conversation.lastMessageTimestamp}</p>
                </div>
                <div className="flex justify-between items-start mt-1">
                    <p className={`text-sm truncate pr-4 ${conversation.unreadCount > 0 ? 'text-gray-800 dark:text-gray-300 font-semibold' : 'text-gray-500'}`}>
                        {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

const MessagesView: React.FC = () => {
    const [query, setQuery] = useState('');

    const filteredConversations = useMemo(() => {
        const sorted = [...CONVERSATIONS].sort((a, b) => {
            // Unread messages first
            if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
            if (b.unreadCount > 0 && a.unreadCount === 0) return 1;

            // Then by most recent date
            return b.lastMessageDate.getTime() - a.lastMessageDate.getTime();
        });
        
        if (!query) return sorted;
        
        const lowerCaseQuery = query.toLowerCase();
        return sorted.filter(convo => {
            const talent = getTalentByConversation(convo);
            return talent?.name.toLowerCase().includes(lowerCaseQuery);
        });
    }, [query]);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3 pl-10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    />
                     <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map(convo => <ConversationCard key={convo.id} conversation={convo} />)
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No messages found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesView;