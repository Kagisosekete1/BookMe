

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

interface SettingsViewProps {
    currentUser: User;
    onLogout: () => void;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 px-4 mb-2">{title}</h3>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            {children}
        </div>
    </div>
);

const SettingsItem: React.FC<{ icon: string; title: string; subtitle?: string; action?: React.ReactNode; isFirst?: boolean; isLast?: boolean; onClick?: () => void; }> = ({ icon, title, subtitle, action, isFirst, isLast, onClick }) => {
    const itemClasses = `flex items-center p-4 ${!isLast ? 'border-b border-gray-200 dark:border-gray-800' : ''} ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`;
    
    return (
        <div className={itemClasses} onClick={onClick}>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg mr-4">
                <i className={`fas ${icon} text-gray-600 dark:text-gray-300`}></i>
            </div>
            <div className="flex-grow">
                <p className="font-semibold">{title}</p>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
            {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
             {onClick && !action && <div className="text-gray-400"><i className="fas fa-chevron-right"></i></div>}
        </div>
    );
};

const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    
    return (
        <div className="p-4 h-full overflow-y-auto bg-gray-50 dark:bg-black">
             <h2 className="text-xl font-bold mb-6 px-4">Settings and Privacy</h2>
            <div className="space-y-6">
                
                <SettingsSection title="Account">
                    <SettingsItem onClick={() => navigate('/settings/account-center')} icon="fa-user-circle" title="Account Center" subtitle="Manage your connected experiences." isFirst isLast />
                </SettingsSection>

                <SettingsSection title="Book Me Premium">
                    <SettingsItem onClick={() => navigate('/settings/subscription')} icon="fa-gem" title="Subscription" subtitle="Go Premium for an ad-free experience." isFirst isLast />
                </SettingsSection>

                <SettingsSection title="Preferences">
                    <SettingsItem onClick={() => navigate('/settings/notifications')} icon="fa-bell" title="Notifications" isFirst />
                    <SettingsItem onClick={() => navigate('/settings/anti-notifications')} icon="fa-bell-slash" title="Anti-notifications" subtitle="Manage quiet time and notification types." />
                    {currentUser.isPremium && (
                        <SettingsItem 
                            onClick={() => navigate('/settings/activity-digest')} 
                            icon="fa-newspaper" 
                            title="Activity Digest" 
                            subtitle="Get daily summaries of profile activity."
                        />
                    )}
                    <SettingsItem onClick={() => navigate('/settings/location')} icon="fa-map-marker-alt" title="Location" subtitle="Manage your location settings." isLast />
                </SettingsSection>
                
                 <SettingsSection title="Security">
                     <SettingsItem onClick={() => navigate('/settings/password-and-security')} icon="fa-lock" title="Password and Security" isFirst isLast />
                 </SettingsSection>

                 <SettingsSection title="Legal & Policies">
                    <SettingsItem onClick={() => navigate('/settings/privacy-policy')} icon="fa-user-secret" title="Privacy Policy" isFirst />
                    <SettingsItem onClick={() => navigate('/settings/faq')} icon="fa-question-circle" title="FAQ" isLast />
                </SettingsSection>

                <div className="pt-4">
                     <button 
                        onClick={onLogout} 
                        className="w-full text-center border-2 border-red-500 text-red-500 font-bold py-3 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-colors"
                     >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;