

import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, User, ThemeAccent } from './types';
import { USERS } from './data/mockData';

// Layout Components
import MainLayout from './components/layout/MainLayout';

// View Components
import AuthView from './components/views/AuthView';
import HomeView from './components/views/HomeView';
import SearchView from './components/views/SearchView';
import CreateView from './components/views/CreateView';
import ReelsView from './components/views/ReelsView';
import SettingsView from './components/views/SettingsView';
import TalentProfileView from './components/views/TalentProfileView';
import MessagesView from './components/views/MessagesView';
import ChatView from './components/views/ChatView';
import SplashScreen from './components/views/SplashScreen';
import ProfileView from './components/views/ProfileView';
import SettingsSubPageView from './components/views/SettingsSubPageView';

type Theme = 'light' | 'dark';

const StatusBar: React.FC = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);
        };

        updateTime();
        const timerId = setInterval(updateTime, 1000 * 30); // Update every 30 seconds

        return () => clearInterval(timerId);
    }, []);
    
    return (
         <div className="absolute top-0 left-0 right-0 h-11 px-8 flex justify-between items-center text-xs font-semibold text-black dark:text-white z-50 pointer-events-none">
            <span>{time}</span>
            <div className="flex items-center space-x-1.5">
                <i className="fas fa-signal"></i>
                <i className="fas fa-wifi"></i>
                <i className="fas fa-battery-full text-sm"></i>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [showSplash, setShowSplash] = useState<boolean>(true);
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'light';
    });
     const [themeAccent, setThemeAccent] = useState<ThemeAccent>(() => {
        const savedAccent = localStorage.getItem('themeAccent') as ThemeAccent;
        return savedAccent || 'blue';
    });
    
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        // Check persistent storage first, then session storage
        const persistentUser = localStorage.getItem('currentUser');
        const sessionUser = sessionStorage.getItem('currentUser');
        const storedUser = persistentUser || sessionUser;

        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error("Failed to parse user from storage", error);
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
            }
        }
        
        // No user found in storage, so return null to show login screen
        return null;
    });

    const isAuthenticated = !!currentUser;

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.dataset.themeAccent = themeAccent;
        localStorage.setItem('themeAccent', themeAccent);
    }, [themeAccent]);


    const handleSetTheme = useCallback((newTheme: Theme) => {
        setTheme(newTheme);
    }, []);

    const handleSetThemeAccent = useCallback((accent: ThemeAccent) => {
        setThemeAccent(accent);
    }, []);

    const handleLogin = useCallback((user: User, rememberMe: boolean) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        setCurrentUser(null);
    }, []);

    const handleUpdateProfile = useCallback((updates: Partial<User>) => {
        if (!currentUser) return;

        // Deep merge settings to avoid overwriting other preferences
        const updatedUser = { 
            ...currentUser, 
            ...updates,
            settings: {
                ...currentUser.settings,
                ...updates.settings,
            },
        };
        
        const userIndex = USERS.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            // Also update the "master" user array in mockData
            USERS[userIndex] = { ...USERS[userIndex], ...updatedUser };
        }
        
        // Update both storages if they exist, to keep sync
        if (localStorage.getItem('currentUser')) {
             localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        if (sessionStorage.getItem('currentUser')) {
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
       
        setCurrentUser(updatedUser);
    }, [currentUser]);

    const appContent = (
        <HashRouter>
            <Routes>
                {isAuthenticated && currentUser ? (
                    <>
                        {/* Routes with MainLayout (Top & Bottom bars) */}
                        <Route path="/" element={<MainLayout currentUser={currentUser} onLogout={handleLogout} />}>
                            <Route index element={<HomeView currentUser={currentUser} />} />
                            <Route path="search" element={<SearchView currentUser={currentUser} />} />
                            <Route path="talent/:talentId" element={<TalentProfileView />} />
                            <Route path="create" element={<CreateView currentUser={currentUser} />} />
                            <Route path="reels" element={<ReelsView currentUser={currentUser} />} />
                            <Route path="profile" element={<ProfileView currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />} />
                            <Route path="settings" element={<SettingsView currentUser={currentUser} onLogout={handleLogout} />} />
                            <Route path="settings/:pageId" element={<SettingsSubPageView user={currentUser} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />} />
                            <Route path="messages" element={<MessagesView />} />
                        </Route>
                        
                        {/* Full screen routes without MainLayout */}
                        <Route path="/messages/:chatId" element={<ChatView />} />

                        {/* Catch-all for any other authenticated route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                ) : (
                    <Route path="*" element={<AuthView onLogin={handleLogin} />} />
                )}
            </Routes>
        </HashRouter>
    );

    return (
        <div className="h-full w-full font-sans text-black dark:text-white flex items-center justify-center">
            {/* iPhone Frame */}
            <div className="iphone-frame">
                {/* iPhone Screen */}
                <div className="iphone-screen">
                    <StatusBar />
                    {/* Dynamic Island */}
                    <div className="iphone-island"></div>
                    {/* App Content */}
                    <div className="w-full h-full bg-white dark:bg-black flex flex-col relative">
                       {appContent}
                       {showSplash && <SplashScreen onFinished={() => setShowSplash(false)} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;