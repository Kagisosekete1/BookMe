

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { User } from '../../types';
import BottomNav from './BottomNav';
import { CONVERSATIONS, getTalentByConversation, generateActivityDigest, ActivityDigest } from '../../data/mockData';

const NotificationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const staticNotifications = [
        { id: 1, type: 'static', icon: 'fa-check-circle', color: 'text-green-500', textParts: [{type: 'link', content: 'Sipho Moyo', path: '/talent/1'}, {type: 'text', content: ' accepted your booking request for "Wedding DJ".'}], time: '15m ago' },
        { id: 3, type: 'static', icon: 'fa-wallet', color: 'text-green-500', textParts: [{type: 'text', content: 'Your payout of R4,800.00 has been processed successfully.'}], time: '5h ago' },
        { id: 4, type: 'static', icon: 'fa-briefcase', color: 'text-orange-500', textParts: [{type: 'text', content: 'New Job Alert: A "Wedding Photographer" job in Cape Town matches your profile.'}], time: '1d ago' },
        { id: 5, type: 'static', icon: 'fa-star', color: 'text-yellow-500', textParts: [{type: 'text', content: 'Jane D. left you a 5-star review for "Corporate Headshots".'}], time: '2d ago' },
    ];

    const messageNotifications = CONVERSATIONS.filter(c => c.unreadCount > 0).map(c => {
        const talent = getTalentByConversation(c);
        return {
            id: c.id,
            type: 'message',
            icon: 'fa-envelope',
            color: 'text-blue-500',
            textParts: [
                { type: 'text', content: 'You have a new message from ' },
                { type: 'link', content: talent?.name || 'Unknown', path: `/messages/${c.id}` },
                { type: 'text', content: '.' }
            ],
            time: c.lastMessageTimestamp,
        };
    });

    const notifications = [...messageNotifications, ...staticNotifications];
    
    return (
        <div className="absolute inset-0 z-40">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in" onClick={onClose}></div>
            
            {/* Panel */}
            <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-lg flex flex-col animate-slide-in-from-right">
                <div className="flex items-center justify-between p-4 pt-16 border-b border-gray-200 dark:border-gray-800 shrink-0">
                    <h2 className="text-lg font-bold">Notifications</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white text-xl">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <div key={`${notif.type}-${notif.id}`} className="flex items-start p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <i className={`fas ${notif.icon} ${notif.color} text-lg w-8 text-center mt-1 shrink-0`}></i>
                                <div className="flex-1 ml-3">
                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                        {notif.textParts.map((part, index) => 
                                            part.type === 'link' && part.path ? (
                                                <Link key={index} to={part.path} onClick={onClose} className="font-bold hover:underline">{part.content}</Link>
                                            ) : (
                                                <span key={index}>{part.content}</span>
                                            )
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 p-8">You have no new notifications.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ActivityDigestBanner: React.FC<{ digest: ActivityDigest; onClose: () => void }> = ({ digest, onClose }) => {
    return (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] z-[100] p-4 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-800 animate-slide-down">
            <button onClick={onClose} className="absolute top-2 right-2 w-6 h-6 bg-gray-500/20 rounded-full text-sm">&times;</button>
            <div className="flex items-center mb-2">
                <i className="fas fa-chart-line text-[var(--accent-color)] text-xl mr-3"></i>
                <h3 className="font-bold text-lg">Your Activity Digest</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start"><i className="fas fa-eye w-5 text-center text-gray-400 mt-1 mr-2"></i><span><strong>{digest.profileViews.sampleViewerName}</strong> and {digest.profileViews.count - 1} others viewed your profile.</span></li>
                <li className="flex items-start"><i className="fas fa-comment w-5 text-center text-gray-400 mt-1 mr-2"></i><span><strong>{digest.newComments.sampleCommenterName}</strong> left a new comment on {digest.newComments.postText}.</span></li>
                <li className="flex items-start"><i className="fas fa-rss w-5 text-center text-gray-400 mt-1 mr-2"></i><span><strong>{digest.newPosts.samplePosterName}</strong> shared a new post.</span></li>
                <li className="flex items-start"><i className="fas fa-briefcase w-5 text-center text-gray-400 mt-1 mr-2"></i><span><strong>{digest.gigsLanded.sampleTalentName}</strong> just landed a new gig!</span></li>
            </ul>
        </div>
    );
};


interface TopBarProps {
    onBack?: () => void;
    onToggleNotifications?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onBack, onToggleNotifications }) => {
    return (
         <div className="flex items-center justify-between p-4 pt-16 h-32 border-b border-gray-200 dark:border-gray-800 shrink-0">
            {onBack ? (
                 <button onClick={onBack} className="text-2xl w-12 h-12 flex items-center justify-center">
                    <i className="fas fa-arrow-left"></i>
                </button>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-black dark:text-white">Book Me</h1>
                    <div className="flex items-center space-x-5 text-2xl text-gray-700 dark:text-gray-300">
                        <button onClick={onToggleNotifications} className="hover:text-black dark:hover:text-white transition-colors">
                            <i className="fas fa-bell"></i>
                        </button>
                        <Link to="/messages" className="hover:text-black dark:hover:text-white transition-colors">
                            <i className="fas fa-envelope"></i>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};


interface MainLayoutProps {
    currentUser: User;
    onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ currentUser, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [activityDigest, setActivityDigest] = useState<ActivityDigest | null>(null);

    useEffect(() => {
        const checkAndShowDigest = () => {
            if (!currentUser.isPremium || !currentUser.settings?.activityDigestEnabled) {
                return;
            }

            const now = new Date();
            const currentHour = now.getHours();
            
            let currentPeriod = 0; // Morning: 00:00 - 09:59
            if (currentHour >= 10 && currentHour < 18) {
                currentPeriod = 1; // Afternoon: 10:00 - 17:59
            } else if (currentHour >= 18) {
                currentPeriod = 2; // Evening: 18:00 - 23:59
            }

            const today = now.toISOString().split('T')[0];
            const lastDigestInfo = JSON.parse(localStorage.getItem('lastDigestInfo') || '{}');

            if (lastDigestInfo.date !== today || lastDigestInfo.period < currentPeriod) {
                const newDigest = generateActivityDigest();
                setActivityDigest(newDigest);
                
                localStorage.setItem('lastDigestInfo', JSON.stringify({
                    date: today,
                    period: currentPeriod
                }));

                setTimeout(() => setActivityDigest(null), 10000); // Auto-dismiss
            }
        };

        const timer = setTimeout(checkAndShowDigest, 3000); // Delay to simulate notification arrival
        return () => clearTimeout(timer);
    }, [currentUser]);

    const handleToggleNotifications = () => {
        setShowNotifications(prev => !prev);
    };
    
    // --- UI State Logic ---
    const isSettingsPage = location.pathname === '/settings';
    const isSettingsSubPage = /^\/settings\/.+/.test(location.pathname);

    const hideTopBar = location.pathname === '/profile' ||
                       location.pathname.startsWith('/talent/') ||
                       isSettingsSubPage;

    // Show back button for messages and the main settings page.
    const showBackButton = location.pathname.startsWith('/messages') || isSettingsPage;
                         
    return (
        <div className="flex flex-col h-full relative">
            {activityDigest && <ActivityDigestBanner digest={activityDigest} onClose={() => setActivityDigest(null)} />}
            {!hideTopBar && <TopBar onBack={showBackButton ? () => navigate(-1) : undefined} onToggleNotifications={handleToggleNotifications} />}
            <main
                className="flex-grow overflow-y-auto relative"
                style={{ height: hideTopBar ? 'calc(100% - 4rem)' : undefined }}
            >
                <Outlet />
                {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
            </main>
            <BottomNav userRole={currentUser.role} />
        </div>
    );
};

export default MainLayout;