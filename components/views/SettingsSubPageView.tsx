



import React, { useState, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { User, LoginSession, Transaction, UserRole, ThemeAccent } from '../../types';
import { LOGIN_SESSIONS, TRANSACTIONS } from '../../data/mockData';

const pageIdToTitle: { [key: string]: string } = {
    'account-center': 'Account Center',
    'notifications': 'Notifications',
    'location': 'Location',
    'password-and-security': 'Password and Security',
    'login-activity': 'Login Activity',
    'personal-details': 'Personal Details',
    'ad-preferences': 'Ad Preferences',
    'payments': 'Payments',
    'appearance': 'Appearance',
    'change-password': 'Change Password',
    'saved-login-info': 'Saved Login Info',
    'two-factor-authentication': 'Two-Factor Authentication',
    'login-alerts': 'Login Alerts',
    'identity-confirmation': 'Identity Confirmation',
};

// Helper components for consistent styling
const SettingsSection: React.FC<{ title?: string; children: React.ReactNode; footer?: string }> = ({ title, children, footer }) => (
    <div>
        {title && <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 px-4 mb-2">{title}</h3>}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            {children}
        </div>
        {footer && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 px-4">{footer}</p>}
    </div>
);

const SettingsItem: React.FC<{ icon: string; title: string; subtitle?: string; isLast?: boolean; onClick?: () => void; }> = ({ icon, title, subtitle, isLast, onClick }) => {
    const itemClasses = `flex items-center p-4 ${!isLast ? 'border-b border-gray-200 dark:border-gray-800' : ''} ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`;
    
    return (
        <div className={itemClasses} onClick={onClick}>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg mr-4 text-center">
                <i className={`fas ${icon} text-gray-600 dark:text-gray-300 w-5`}></i>
            </div>
            <div className="flex-grow">
                <p className="font-semibold">{title}</p>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
            {onClick && <div className="text-gray-400"><i className="fas fa-chevron-right"></i></div>}
        </div>
    );
};

const ToggleItem: React.FC<{ title: string; subtitle: string; isLast?: boolean; checked?: boolean; onChange?: () => void; }> = ({ title, subtitle, isLast, checked, onChange }) => (
     <div className={`flex items-center p-4 ${!isLast ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
        <div className="flex-grow">
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <label className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--accent-color)]"></div>
        </label>
    </div>
);

// --- Content Components for Each Page ---

const AppearanceContent: React.FC<{ theme: 'light' | 'dark', onSetTheme: (theme: 'light' | 'dark') => void, themeAccent: ThemeAccent, onSetThemeAccent: (accent: ThemeAccent) => void }> = ({ theme, onSetTheme, themeAccent, onSetThemeAccent }) => {
    const accents: { name: ThemeAccent, color: string }[] = [
        { name: 'blue', color: 'bg-blue-500' },
        { name: 'green', color: 'bg-green-500' },
        { name: 'pink', color: 'bg-pink-500' },
        { name: 'orange', color: 'bg-orange-500' },
    ];
    return (
        <div className="space-y-8">
            <SettingsSection title="Mode" footer="Choose whether you want Book Me to be in light or dark mode.">
                 <div onClick={() => onSetTheme('light')} className={`flex items-center p-4 cursor-pointer border-b border-gray-200 dark:border-gray-800 transition-colors ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mr-4 shrink-0">
                        {theme === 'light' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]"></div>}
                    </div>
                    <div>
                        <p className="font-semibold">Light Mode</p>
                        <p className="text-xs text-gray-500">A light background for daytime use.</p>
                    </div>
                </div>
                <div onClick={() => onSetTheme('dark')} className={`flex items-center p-4 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
                     <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mr-4 shrink-0">
                        {theme === 'dark' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]"></div>}
                    </div>
                    <div>
                        <p className="font-semibold">Dark Mode</p>
                        <p className="text-xs text-gray-500">Reduce glare and improve night viewing.</p>
                    </div>
                </div>
            </SettingsSection>
            
            <SettingsSection title="Color" footer="Choose your preferred color scheme for buttons, links, and highlights across the Book Me app.">
                <div className="p-4 grid grid-cols-4 gap-4">
                     {accents.map(accent => (
                        <button 
                            key={accent.name} 
                            onClick={() => onSetThemeAccent(accent.name)} 
                            className={`aspect-square rounded-lg ${accent.color} flex items-center justify-center transition-transform transform hover:scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ${themeAccent === accent.name ? 'ring-[var(--accent-color)]' : 'ring-transparent'}`}
                            aria-label={`Set theme to ${accent.name}`}
                        >
                            {themeAccent === accent.name && <i className="fas fa-check text-white text-xl"></i>}
                        </button>
                    ))}
                </div>
            </SettingsSection>
        </div>
    );
};

const AccountCenterIndexContent: React.FC<{ user: User }> = ({ user }) => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm text-center">
                <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-gray-200 dark:ring-gray-700" />
                <h3 className="font-bold text-xl">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1 capitalize">{user.role}</p>
            </div>

             <SettingsSection title="Profiles">
                 <SettingsItem icon="fa-user" title={user.name} subtitle="Book Me Profile" isLast />
             </SettingsSection>

            <SettingsSection title="Account Settings">
                <SettingsItem icon="fa-id-card" title="Personal Details" subtitle="Update your name, birthday, and contact info." onClick={() => navigate('/settings/personal-details')}/>
                <SettingsItem icon="fa-shield-alt" title="Password and Security" subtitle="Change password, 2FA, see login activity." onClick={() => navigate('/settings/password-and-security')} />
                <SettingsItem icon="fa-bullhorn" title="Ad Preferences" subtitle="Manage your ad topics and data settings." onClick={() => navigate('/settings/ad-preferences')} />
                 <SettingsItem icon="fa-credit-card" title={user.role === UserRole.Talent ? "Payouts" : "Payments"} subtitle={user.role === UserRole.Talent ? "Manage payout methods and history." : "Manage booking payments and methods."} isLast onClick={() => navigate('/settings/payments')} />
            </SettingsSection>
            
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 px-4">
               Control settings for connected experiences across Book Me. Your profile information, security settings, and ad preferences are managed here.
            </p>
        </div>
    );
};

const PersonalDetailsContent: React.FC<{ user: User; onEditDob: () => void; onEditPhone: () => void; }> = ({ user, onEditDob, onEditPhone }) => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <SettingsSection title="Contact Info" footer="This information is used to contact you about your bookings and account updates.">
                <SettingsItem icon="fa-envelope" title="Email address" subtitle={user.email} />
                <SettingsItem icon="fa-phone" title="Phone number" subtitle={user.phoneNumber || "Not provided"} isLast onClick={onEditPhone} />
            </SettingsSection>
            {user.role === UserRole.Talent && user.profession && (
                <SettingsSection title="Professional Info">
                    <SettingsItem icon="fa-briefcase" title="Profession" subtitle={user.profession} isLast />
                </SettingsSection>
            )}
            <SettingsSection title="Identity" footer="This information is required for verification and safety on the Book Me platform.">
                 <SettingsItem icon="fa-calendar-day" title="Date of birth" subtitle="January 1, 1990" onClick={onEditDob} />
                 <SettingsItem icon="fa-check-circle" title="Identity confirmation" subtitle="Get verified on Book Me" isLast onClick={() => navigate('/settings/identity-confirmation')} />
            </SettingsSection>
        </div>
    );
};

const IdentityConfirmationContent: React.FC<{ 
    onSubscribeBlue: () => void;
    documentType: 'id' | 'passport';
    setDocumentType: (type: 'id' | 'passport') => void;
    documentPhoto: string | null;
    selfiePhoto: string | null;
    onDocumentPhotoClick: () => void;
    onSelfiePhotoClick: () => void;
}> = ({ onSubscribeBlue, documentType, setDocumentType, documentPhoto, selfiePhoto, onDocumentPhotoClick, onSelfiePhotoClick }) => (
    <div className="space-y-8">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Get verified to build trust on the Book Me platform. A verified badge shows others that you're authentic.</p>
        </div>
        
        {/* Blue Badge */}
        <SettingsSection title="Blue Badge">
            <div className="p-4">
                <div className="flex items-start space-x-4">
                    <i className="fas fa-star text-blue-500 text-2xl mt-1"></i>
                    <div>
                        <h4 className="font-bold">Subscribe to Book Me Blue</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get a blue verification badge next to your name with a subscription. Stand out and get noticed faster.</p>
                        <button onClick={onSubscribeBlue} className="mt-3 text-sm font-bold border-2 border-[var(--accent-color)] text-[var(--accent-color)] py-2 px-4 rounded-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                            Subscribe for R49.99/month
                        </button>
                    </div>
                </div>
            </div>
        </SettingsSection>

        {/* Gold Badge */}
        <SettingsSection title="Gold Badge" footer="Your documents are handled securely and are only used for verification purposes.">
            <div className="p-4 space-y-4">
                <div className="flex items-start space-x-4">
                    <i className="fas fa-star text-yellow-500 text-2xl mt-1"></i>
                    <div>
                        <h4 className="font-bold">Apply for a Gold Badge</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get our highest level of verification by confirming your identity with a government-issued ID.</p>
                    </div>
                </div>
                
                {/* Step 1: Document Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. Choose your ID type</label>
                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value as 'id' | 'passport')} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none">
                        <option value="id">Identity Card</option>
                        <option value="passport">Passport</option>
                    </select>
                </div>
                
                {/* Step 2: Upload Document */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. Photo of your document</label>
                    {documentPhoto ? (
                         <div className="relative">
                            <img src={documentPhoto} alt="Document Preview" className="w-full rounded-md object-cover" />
                            <button onClick={onDocumentPhotoClick} className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                <i className="fas fa-redo"></i>
                            </button>
                        </div>
                    ) : (
                        <button onClick={onDocumentPhotoClick} className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                             <i className="fas fa-camera mr-3"></i>
                             <span>Take Photo</span>
                        </button>
                    )}
                </div>

                {/* Step 3: Upload Selfie */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">3. Photo of you holding your document</label>
                     {selfiePhoto ? (
                         <div className="relative">
                            <img src={selfiePhoto} alt="Selfie Preview" className="w-full rounded-md object-cover" />
                             <button onClick={onSelfiePhotoClick} className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                <i className="fas fa-redo"></i>
                            </button>
                        </div>
                    ) : (
                        <button onClick={onSelfiePhotoClick} className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                             <i className="fas fa-user-check mr-3"></i>
                             <span>Take Selfie</span>
                        </button>
                    )}
                </div>

                <button className="w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors disabled:opacity-50" disabled={!documentPhoto || !selfiePhoto}>
                    Submit for Review
                </button>
            </div>
        </SettingsSection>
    </div>
);


const AdPreferencesContent: React.FC = () => (
    <div className="space-y-6">
        <SettingsSection title="Ad Topics" footer="You may see ads from these categories based on your activity on Book Me.">
            <SettingsItem icon="fa-music" title="Events & Music" />
            <SettingsItem icon="fa-camera" title="Photography & Video" />
            <SettingsItem icon="fa-utensils" title="Food & Catering" isLast />
        </SettingsSection>
        <SettingsSection title="Data about your activity from partners" footer="Control whether we use data from our ad partners to show you more relevant ads.">
            <ToggleItem title="Use Partner Data" subtitle="This allows Book Me to personalize your ad experience." isLast checked onChange={() => {}}/>
        </SettingsSection>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 px-4">
            Book Me is committed to providing a transparent and personalized ad experience. You are in control of your data.
        </p>
    </div>
);

const TransactionHistory: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'Completed': return 'text-green-500';
            case 'Pending': return 'text-yellow-500';
            case 'Failed': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };
    return (
        <div className="space-y-2">
            {transactions.map(tx => (
                <div key={tx.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <img src={tx.talentProfileImage} alt={tx.talentName} className="w-10 h-10 rounded-full mr-3" />
                    <div className="flex-grow">
                        <p className="font-semibold text-sm">{tx.description}</p>
                        <p className="text-xs text-gray-500">{tx.date} · <span className={getStatusColor(tx.status)}>{tx.status}</span></p>
                    </div>
                    <p className={`font-bold text-sm ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {tx.amount < 0 ? '-' : '+'}R {Math.abs(tx.amount).toFixed(2)}
                    </p>
                </div>
            ))}
        </div>
    );
};

const PaymentsContent: React.FC<{ user: User }> = ({ user }) => {
    if (user.role === UserRole.Talent) {
        const talentPayouts = TRANSACTIONS.filter(tx => tx.amount > 0);
        return (
            <div className="space-y-6">
                <SettingsSection title="Payout Methods" footer="Your primary payout method for gigs on Book Me.">
                     <SettingsItem icon="fa-university" title="FNB Bank Account **** 5678" subtitle="Primary" />
                     <SettingsItem icon="fa-plus-circle" title="Add Payout Method" isLast />
                </SettingsSection>
                <SettingsSection title="Payout History">
                    <TransactionHistory transactions={talentPayouts} />
                </SettingsSection>
            </div>
        )
    }

    // Client View
    const clientPayments = TRANSACTIONS.filter(tx => tx.amount < 0);
    return (
        <div className="space-y-6">
            <SettingsSection title="Payment Methods" footer="Your primary payment method for bookings on Book Me.">
                 <SettingsItem icon="fa-credit-card" title="Visa **** 1234" subtitle="Primary" />
                 <SettingsItem icon="fa-plus-circle" title="Add Payment Method" isLast />
            </SettingsSection>
            <SettingsSection title="Transaction History">
                <TransactionHistory transactions={clientPayments} />
            </SettingsSection>
        </div>
    );
};


const TalentNotificationsContent: React.FC = () => {
    const [settings, setSettings] = useState({
        messages: true,
        newBookings: true,
        newReviews: false,
        payouts: true,
        promotions: false,
        weeklySummary: true,
        newsUpdates: false,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <SettingsSection title="Push Notifications" footer="Receive push notifications for these events on your device.">
                <ToggleItem title="Messages" subtitle="Get notified for new direct messages." checked={settings.messages} onChange={() => handleToggle('messages')} />
                <ToggleItem title="New Booking Requests" subtitle="From clients interested in your services." checked={settings.newBookings} onChange={() => handleToggle('newBookings')} />
                <ToggleItem title="New Reviews" subtitle="When a client leaves you a review." checked={settings.newReviews} onChange={() => handleToggle('newReviews')} />
                <ToggleItem title="Payout Notifications" subtitle="When a payout is processed." checked={settings.payouts} onChange={() => handleToggle('payouts')} />
                <ToggleItem title="Promotions from Book Me" subtitle="Offers, news, and platform updates." isLast checked={settings.promotions} onChange={() => handleToggle('promotions')} />
            </SettingsSection>
            <SettingsSection title="Email Notifications" footer="Receive emails for important updates.">
                <ToggleItem title="Weekly Summary" subtitle="Get a summary of your earnings and reviews." checked={settings.weeklySummary} onChange={() => handleToggle('weeklySummary')} />
                <ToggleItem title="News and Updates" subtitle="Stay in the loop with the Book Me newsletter." isLast checked={settings.newsUpdates} onChange={() => handleToggle('newsUpdates')} />
            </SettingsSection>
        </div>
    );
};

const ClientNotificationsContent: React.FC = () => {
    const [settings, setSettings] = useState({
        messages: true,
        bookingUpdates: true,
        recommendations: true,
        promotions: false,
        bookingConfirmations: true,
        newsUpdates: true,
        feedbackSurveys: false,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <SettingsSection title="Push Notifications" footer="Receive push notifications for these events on your device.">
                <ToggleItem title="Messages" subtitle="Get notified for new direct messages." checked={settings.messages} onChange={() => handleToggle('messages')} />
                <ToggleItem title="Booking Updates" subtitle="Confirmations, changes, and reminders." checked={settings.bookingUpdates} onChange={() => handleToggle('bookingUpdates')} />
                <ToggleItem title="Talent Recommendations" subtitle="Discover new talent in your area." checked={settings.recommendations} onChange={() => handleToggle('recommendations')} />
                <ToggleItem title="Promotions from Book Me" subtitle="Offers, news, and platform updates." isLast checked={settings.promotions} onChange={() => handleToggle('promotions')} />
            </SettingsSection>
            <SettingsSection title="Email Notifications" footer="Receive emails for important updates.">
                <ToggleItem title="Booking Confirmations" subtitle="Get an email receipt for every booking." checked={settings.bookingConfirmations} onChange={() => handleToggle('bookingConfirmations')} />
                <ToggleItem title="News and Updates" subtitle="Stay in the loop with the Book Me newsletter." checked={settings.newsUpdates} onChange={() => handleToggle('newsUpdates')} />
                <ToggleItem title="Feedback Surveys" subtitle="Help us improve the Book Me experience." isLast checked={settings.feedbackSurveys} onChange={() => handleToggle('feedbackSurveys')} />
            </SettingsSection>
        </div>
    );
};


const NotificationsContent: React.FC<{ user: User }> = ({ user }) => {
    return user.role === UserRole.Talent ? <TalentNotificationsContent /> : <ClientNotificationsContent />;
};

const LocationContent: React.FC<{ user: User }> = ({ user }) => {
    const footerText = user.role === UserRole.Talent
        ? "Book Me uses your location to help clients discover you for nearby gigs and for safety purposes."
        : "Book Me uses your location to help you discover nearby talent and for safety and security purposes.";

    return (
        <div className="space-y-6">
             <SettingsSection footer={footerText}>
                <SettingsItem icon="fa-map-pin" title="Device Location" subtitle="While using the app" />
                <ToggleItem title="Precise Location" subtitle="Allows Book Me to use your specific location. You can turn this off in your device's settings." isLast />
             </SettingsSection>
        </div>
    );
};

const PasswordAndSecurityContent: React.FC = () => {
    const navigate = useNavigate();
    return (
     <div className="space-y-6">
        <SettingsSection title="Login">
            <SettingsItem icon="fa-key" title="Change Password" onClick={() => navigate('/settings/change-password')} />
            <SettingsItem icon="fa-save" title="Saved Login Info" subtitle="Book Me will remember your login on this device." isLast onClick={() => navigate('/settings/saved-login-info')} />
        </SettingsSection>
        <SettingsSection title="Security Checks">
             <SettingsItem icon="fa-user-shield" title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account." onClick={() => navigate('/settings/two-factor-authentication')} />
             <SettingsItem icon="fa-bell" title="Login Alerts" subtitle="Get alerts about unrecognized logins." onClick={() => navigate('/settings/login-alerts')} />
             <SettingsItem icon="fa-history" title="Login Activity" subtitle="See where you're logged in." isLast onClick={() => navigate('/settings/login-activity')} />
        </SettingsSection>
     </div>
    );
};

const LoginActivityContent: React.FC = () => (
    <SettingsSection title="Where you're logged in">
        {LOGIN_SESSIONS.map((session, index) => (
            <div key={session.id} className={`p-4 ${index < LOGIN_SESSIONS.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
                <div className="flex items-center">
                    <i className={`fas ${session.device.includes('iPhone') || session.device.includes('Samsung') ? 'fa-mobile-alt' : 'fa-laptop'} text-2xl w-8 text-center mr-4 text-gray-500`}></i>
                    <div className="flex-grow">
                        <p className="font-bold text-sm">{session.device}</p>
                        <p className="text-xs text-gray-500">{session.location}</p>
                    </div>
                     <button className="text-xs font-semibold text-gray-500 hover:text-red-500">Log out</button>
                </div>
            </div>
        ))}
    </SettingsSection>
);

const ChangePasswordContent: React.FC = () => (
    <div className="space-y-4">
        <input className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3" type="password" placeholder="Current Password" />
        <input className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3" type="password" placeholder="New Password" />
        <input className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3" type="password" placeholder="Re-type New Password" />
        <button className="w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors">Update Password</button>
    </div>
);

const SavedLoginInfoContent: React.FC = () => (
    <SettingsSection title="Logged in with Book Me on this device">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <p className="font-bold">This Browser</p>
            <p className="text-sm text-gray-500">Saved from this browser on July 29, 2024</p>
        </div>
        <div className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <p className="text-red-500 font-semibold">Remove Saved Login</p>
        </div>
    </SettingsSection>
);

const TwoFactorAuthContent: React.FC = () => (
    <div className="space-y-6">
        <div className="text-center">
             <i className="fas fa-user-shield text-4xl text-blue-500 mb-3"></i>
             <p className="text-gray-600 dark:text-gray-400">Two-factor authentication is an enhanced security feature. Once enabled, Book Me will require a login code in addition to your password.</p>
        </div>
        <SettingsSection title="Select a Security Method">
             <SettingsItem icon="fa-mobile-alt" title="Authenticator App (Recommended)" subtitle="Get a verification code from an app like Google Authenticator or Duo." />
             <SettingsItem icon="fa-comment-dots" title="Text Message (SMS)" subtitle="We'll text a code to your mobile number." isLast />
        </SettingsSection>
    </div>
);

const LoginAlertsContent: React.FC = () => (
     <div className="space-y-6">
        <SettingsSection title="How you'll get alerts" footer="We'll let you know whenever your Book Me account is logged in from a new device or browser.">
            <ToggleItem title="In-app notifications" subtitle="You'll get a notification inside the Book Me app." />
            <ToggleItem title="Email" subtitle="Alerts will be sent to your registered email address." isLast/>
        </SettingsSection>
     </div>
);

const EditDateOfBirthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4">
                <h3 className="text-lg font-bold mb-4 text-center">Edit Date of Birth</h3>
                <p className="text-center text-sm text-gray-500 mb-4">This can only be changed a few times. Make sure you enter the correct date.</p>
                <input
                    type="date"
                    defaultValue="1990-01-01"
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none"
                />
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="border border-gray-300 dark:border-gray-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                    <button onClick={onClose} className="border border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-2 px-4 rounded-lg text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

const EditPhoneNumberModal: React.FC<{ user: User; onClose: () => void; onUpdateProfile: (updates: Partial<User>) => void; }> = ({ user, onClose, onUpdateProfile }) => {
    const [phone, setPhone] = useState(user.phoneNumber || '');

    const handleSave = () => {
        onUpdateProfile({ phoneNumber: phone });
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4">
                <h3 className="text-lg font-bold mb-4 text-center">Edit Phone Number</h3>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none"
                />
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="border border-gray-300 dark:border-gray-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="border border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-2 px-4 rounded-lg text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

const BlueBadgeSubscriptionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4 text-center">
                 <i className="fas fa-star text-blue-500 text-4xl mb-3"></i>
                <h3 className="text-lg font-bold mb-2">Confirm Subscription</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You're subscribing to Book Me Blue for R49.99/month. Your primary payment method will be charged.</p>
                <div className="mt-6 flex flex-col space-y-2">
                     <button onClick={onClose} className="w-full border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white font-bold py-3 px-4 rounded-lg text-md hover:opacity-90 transition-opacity">Confirm Payment</button>
                    <button onClick={onClose} className="w-full text-gray-600 dark:text-gray-300 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
};


interface SettingsSubPageProps {
    user: User | null;
    onUpdateProfile: (updates: Partial<User>) => void;
    theme: 'light' | 'dark';
    onSetTheme: (theme: 'light' | 'dark') => void;
    themeAccent: ThemeAccent;
    onSetThemeAccent: (accent: ThemeAccent) => void;
}

const SettingsSubPageView: React.FC<SettingsSubPageProps> = ({ user, onUpdateProfile, theme, onSetTheme, themeAccent, onSetThemeAccent }) => {
    const { pageId } = useParams<{ pageId: string }>();
    const [isDobModalOpen, setIsDobModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [isBlueBadgeModalOpen, setIsBlueBadgeModalOpen] = useState(false);

    // State for Identity Confirmation
    const [documentType, setDocumentType] = useState<'id' | 'passport'>('id');
    const [documentPhoto, setDocumentPhoto] = useState<string | null>(null);
    const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);

    const documentPhotoInputRef = useRef<HTMLInputElement>(null);
    const selfiePhotoInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    if (!pageId || !pageIdToTitle[pageId]) return <Navigate to="/settings" replace />;
    if (!user) return <Navigate to="/" replace />;

    const title = pageId === 'payments' 
        ? (user.role === UserRole.Talent ? 'Payouts' : 'Payments')
        : pageIdToTitle[pageId];

    const renderContent = () => {
        switch (pageId) {
            case 'appearance':
                return <AppearanceContent theme={theme} onSetTheme={onSetTheme} themeAccent={themeAccent} onSetThemeAccent={onSetThemeAccent} />;
            case 'account-center':
                return <AccountCenterIndexContent user={user} />;
            case 'notifications':
                return <NotificationsContent user={user} />;
            case 'location':
                return <LocationContent user={user} />;
            case 'password-and-security':
                return <PasswordAndSecurityContent />;
            case 'login-activity':
                return <LoginActivityContent />;
            case 'personal-details':
                return <PersonalDetailsContent user={user} onEditDob={() => setIsDobModalOpen(true)} onEditPhone={() => setIsPhoneModalOpen(true)} />;
            case 'identity-confirmation':
                 return (
                    <>
                        <input type="file" accept="image/*" capture="environment" ref={documentPhotoInputRef} onChange={(e) => handleFileSelect(e, setDocumentPhoto)} className="hidden" />
                        <input type="file" accept="image/*" capture="user" ref={selfiePhotoInputRef} onChange={(e) => handleFileSelect(e, setSelfiePhoto)} className="hidden" />
                        <IdentityConfirmationContent
                            onSubscribeBlue={() => setIsBlueBadgeModalOpen(true)}
                            documentType={documentType}
                            setDocumentType={setDocumentType}
                            documentPhoto={documentPhoto}
                            selfiePhoto={selfiePhoto}
                            onDocumentPhotoClick={() => documentPhotoInputRef.current?.click()}
                            onSelfiePhotoClick={() => selfiePhotoInputRef.current?.click()}
                        />
                    </>
                );
            case 'ad-preferences':
                return <AdPreferencesContent />;
            case 'payments':
                return <PaymentsContent user={user} />;
            case 'change-password':
                return <ChangePasswordContent />;
            case 'saved-login-info':
                return <SavedLoginInfoContent />;
            case 'two-factor-authentication':
                return <TwoFactorAuthContent />;
            case 'login-alerts':
                return <LoginAlertsContent />;
            default:
                return (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-20">
                        <i className="fas fa-tools text-4xl mb-4"></i>
                        <p>Content for this page is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-4 h-full overflow-y-auto bg-gray-50 dark:bg-black relative">
            <h2 className="text-xl font-bold mb-6 px-4">{title}</h2>
            {renderContent()}
            {isDobModalOpen && <EditDateOfBirthModal onClose={() => setIsDobModalOpen(false)} />}
            {isPhoneModalOpen && <EditPhoneNumberModal user={user} onClose={() => setIsPhoneModalOpen(false)} onUpdateProfile={onUpdateProfile} />}
            {isBlueBadgeModalOpen && <BlueBadgeSubscriptionModal onClose={() => setIsBlueBadgeModalOpen(false)} />}
        </div>
    );
};

export default SettingsSubPageView;