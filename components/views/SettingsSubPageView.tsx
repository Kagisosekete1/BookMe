import React, { useState, useRef, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { User, LoginSession, Transaction, UserRole, ThemeAccent } from '../../types';
import { LOGIN_SESSIONS, TRANSACTIONS, TALENTS, updateUserPassword, USERS } from '../../data/mockData';

const pageIdToTitle: { [key: string]: string } = {
    'account-center': 'Account Center',
    'notifications': 'Notifications',
    'location': 'Location',
    'password-and-security': 'Password and Security',
    'login-activity': 'Login Activity',
    'personal-details': 'Personal Details',
    'ad-preferences': 'Ad Preferences',
    'job-history': 'Previous Jobs',
    'booking-history': 'Previous Talents',
    'appearance': 'Appearance',
    'change-password': 'Change Password',
    'saved-login-info': 'Saved Login Info',
    'two-factor-authentication': 'Two-Factor Authentication',
    '2fa-authenticator': 'Authenticator App Setup',
    '2fa-sms': 'SMS Verification Setup',
    'login-alerts': 'Login Alerts',
    'identity-confirmation': 'Identity Confirmation',
    'subscription': 'Book Me Premium',
    'terms-of-use': 'Terms of Use',
    'privacy-policy': 'Privacy Policy',
    'faq': 'Frequently Asked Questions',
};

// --- Reusable Components ---

const Header: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => (
    <div className="flex items-center p-3 pt-12 border-b border-gray-200 dark:border-gray-800 shrink-0 h-28 bg-gray-50 dark:bg-black sticky top-0 z-10">
        <button onClick={onBack} className="text-xl w-10 text-center shrink-0">
            <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="font-bold text-xl flex items-center justify-center flex-grow pr-10">
            {title}
        </h2>
    </div>
);

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

const getVerificationIcon = (userOrTalent: { verificationTier?: 'gold' | 'blue', isPremium?: boolean }) => {
    if (userOrTalent.isPremium) {
        return <i className={`fas fa-gem text-yellow-500 ml-1.5 text-xs`} title="Premium Subscriber"></i>;
    }
    const talent = TALENTS.find(t => t.name === (userOrTalent as User).name);
    const user = USERS.find(u => u.name === (userOrTalent as User).name);

    const tier = talent?.verificationTier || user?.verificationTier;
    if (tier) {
        const color = tier === 'gold' ? 'text-yellow-400' : 'text-blue-500';
        return <i className={`fas fa-check-circle ${color} ml-1.5 text-xs`} title="Verified"></i>;
    }
    return null;
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

const LegalContentWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 text-sm text-gray-700 dark:text-gray-300 space-y-4">
        {children}
    </div>
);

const TermsOfUseContent: React.FC = () => (
    <LegalContentWrapper>
        <h4 className="font-bold text-lg text-black dark:text-white">Book Me App — Terms of Use</h4>
        <p className="text-xs text-gray-500">
            <strong>Effective Date:</strong> October 2025<br />
            <strong>Last Updated:</strong> October 5, 2025
        </p>
        <p>Welcome to Book Me App, a platform powered by SE-MO Group (Pty) Ltd, designed to connect independent creatives, service providers, and clients for easy and secure bookings. By accessing or using Book Me App (“the App,” “we,” “us,” or “our”), you agree to these Terms of Use (“Terms”).</p>
        <p>If you do not agree, please do not use the App.</p>
        <h5 className="font-bold text-black dark:text-white pt-2">1. Overview</h5>
        <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Create profiles as Service Providers (artists, DJs, caterers, stylists, etc.) or Clients (those looking to book someone).</li>
            <li>Share images, videos, posts, and reels.</li>
            <li>Manage and receive bookings directly through the App.</li>
            <li>Choose between Free (Ad-supported) or Premium (Ad-free) membership options.</li>
        </ul>
        <h5 className="font-bold text-black dark:text-white pt-2">6. Free and Premium Memberships</h5>
        <h6 className="font-semibold text-black dark:text-white pl-2">6.1 Free Users</h6>
        <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Access all standard features of the App.</li>
            <li>Experience in-app advertisements displayed during use.</li>
        </ul>
        <h6 className="font-semibold text-black dark:text-white pl-2">6.2 Premium Users</h6>
         <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Subscribe for R150 per month to enjoy an ad-free experience.</li>
            <li>Premium users receive a special Gold Verification Tick.</li>
        </ul>
        <h5 className="font-bold text-black dark:text-white pt-2">16. Contact Us</h5>
        <p>📧 <a href="mailto:info@se-mogroup.com" className="text-[var(--accent-color)] underline">info@se-mogroup.com</a></p>
        <p>🌐 <a href="http://www.se-mogroup.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] underline">www.se-mogroup.com</a></p>
    </LegalContentWrapper>
);

const PrivacyPolicyContent: React.FC = () => (
    <LegalContentWrapper>
        <h4 className="font-bold text-lg text-black dark:text-white">Book Me App — Privacy Policy</h4>
        <p className="text-xs text-gray-500">
            <strong>Effective Date:</strong> October 2025<br />
            <strong>Last Updated:</strong> October 5, 2025
        </p>
        <p>At Book Me App, powered by SE-MO Group (Pty) Ltd, your privacy matters. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
        <h5 className="font-bold text-black dark:text-white pt-2">1. Information We Collect</h5>
        <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Personal Information (Name, email, profile details, uploads)</li>
            <li>Payment Information (for Premium Users via secure third parties)</li>
            <li>Usage Data (likes, comments, bookings, device info)</li>
            <li>Optional Data (location, communication preferences)</li>
        </ul>
        <h5 className="font-bold text-black dark:text-white pt-2">2. How We Use Your Information</h5>
        <p>We use your information to create and manage your account, facilitate bookings, display content, manage subscriptions, communicate with you, and prevent fraud. We will never sell your personal information.</p>
        <h5 className="font-bold text-black dark:text-white pt-2">7. Your Rights</h5>
        <p>You may have the right to access, correct, or delete your personal data. To exercise these rights, email us.</p>
        <h5 className="font-bold text-black dark:text-white pt-2">12. Contact Us</h5>
        <p>If you have questions or privacy concerns, contact us at:</p>
        <p>📧 <a href="mailto:info@se-mogroup.com" className="text-[var(--accent-color)] underline">info@se-mogroup.com</a></p>
        <p>🌐 <a href="http://www.se-mogroup.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] underline">www.se-mogroup.com</a></p>
    </LegalContentWrapper>
);

const FaqContent: React.FC = () => (
    <LegalContentWrapper>
        <div className="space-y-4">
            <div>
                <h5 className="font-bold text-black dark:text-white">1. What is Book Me App?</h5>
                <p>Book Me App is a platform that connects independent hustlers (artists, makeup artists, etc.) with clients who need their services.</p>
            </div>
            <div>
                <h5 className="font-bold text-black dark:text-white">3. Is Book Me App free to use?</h5>
                <p>Yes, the app is free to download and use with ads. You can upgrade to Premium (R150/month) to remove ads and get a Gold Verification Tick.</p>
            </div>
            <div>
                <h5 className="font-bold text-black dark:text-white">4. What is the Gold Verification Tick?</h5>
                <p>The Gold Tick is given to Premium users. It shows that your account is verified, trusted, and part of the premium community.</p>
            </div>
             <div>
                <h5 className="font-bold text-black dark:text-white">8. What if someone doesn’t show up or I get scammed?</h5>
                <p>We encourage users to communicate clearly before booking. If you suspect a scam, report or block the user immediately. Our support team will review all reports.</p>
            </div>
            <div>
                <h5 className="font-bold text-black dark:text-white">14. Where can I get help or contact support?</h5>
                <p>You can reach our support team at: 📧 info@se-mogroup.com</p>
            </div>
        </div>
    </LegalContentWrapper>
);

const SubscriptionConfirmationModal: React.FC<{ onClose: () => void; onConfirm: () => void; }> = ({ onClose, onConfirm }) => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4 text-center" onClick={e => e.stopPropagation()}>
            <i className="fas fa-gem text-yellow-500 text-4xl mb-3"></i>
            <h3 className="text-lg font-bold mb-2">Confirm Subscription</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You're subscribing to Book Me Premium for R150.00/month. Your primary payment method will be charged.</p>
            <div className="mt-6 flex flex-col space-y-2">
                 <button onClick={onConfirm} className="w-full border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white font-bold py-3 px-4 rounded-lg text-md hover:opacity-90 transition-opacity">Confirm Payment</button>
                <button onClick={onClose} className="w-full text-gray-600 dark:text-gray-300 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            </div>
        </div>
    </div>
);

const SubscriptionContent: React.FC<{ user: User; onSubscribe: () => void; }> = ({ user, onSubscribe }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = () => {
        onSubscribe();
        setIsConfirming(false);
    };

    return (
        <>
            <div className="space-y-8">
                <div className="bg-gradient-to-br from-yellow-300 to-orange-400 dark:from-yellow-600 dark:to-orange-700 rounded-lg p-6 text-center shadow-lg">
                    <i className="fas fa-gem text-white text-5xl mb-3"></i>
                    <h2 className="text-2xl font-bold text-white">Book Me Premium</h2>
                    {user.isPremium ? (
                        <p className="text-white opacity-90 mt-1">You are a Premium member. Thank you for your support!</p>
                    ) : (
                        <p className="text-white opacity-90 mt-1">Unlock exclusive features and an ad-free experience.</p>
                    )}
                </div>

                <SettingsSection title="Premium Benefits">
                    <div className="p-4 space-y-4">
                        <div className="flex items-center"><i className="fas fa-check-circle text-green-500 w-6 text-center mr-3"></i><p>Gold Verification Badge</p></div>
                        <div className="flex items-center"><i className="fas fa-check-circle text-green-500 w-6 text-center mr-3"></i><p>Ad-Free Experience</p></div>
                        <div className="flex items-center"><i className="fas fa-check-circle text-green-500 w-6 text-center mr-3"></i><p>Priority Support</p></div>
                        <div className="flex items-center"><i className="fas fa-check-circle text-green-500 w-6 text-center mr-3"></i><p>Enhanced Profile Visibility</p></div>
                    </div>
                </SettingsSection>

                {user.isPremium ? (
                     <SettingsSection title="Manage Subscription">
                         <SettingsItem icon="fa-credit-card" title="Payment Method" subtitle="Mastercard **** 1234" />
                         <SettingsItem icon="fa-file-invoice-dollar" title="Billing History" />
                         <SettingsItem icon="fa-times-circle" title="Cancel Subscription" isLast />
                     </SettingsSection>
                ) : (
                    <div className="pt-2">
                        <button onClick={() => setIsConfirming(true)} className="w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                            Subscribe for R150.00/month
                        </button>
                    </div>
                )}
            </div>
            {isConfirming && <SubscriptionConfirmationModal onClose={() => setIsConfirming(false)} onConfirm={handleConfirm} />}
        </>
    );
};


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
                 {user.role === UserRole.Talent ? (
                    <SettingsItem icon="fa-history" title="Previous Jobs" subtitle="View your completed job history." isLast onClick={() => navigate('/settings/job-history')} />
                ) : (
                    <SettingsItem icon="fa-users" title="Previous Talents" subtitle="View talents you've booked before." isLast onClick={() => navigate('/settings/booking-history')} />
                )}
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

const PreviousJobsContent: React.FC<{ user: User }> = ({ user }) => {
    const completedJobs = TRANSACTIONS.filter(tx => tx.talentName === user.name && tx.amount > 0);

    if (completedJobs.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-20">
                <i className="fas fa-history text-4xl mb-4"></i>
                <p>No completed jobs found.</p>
            </div>
        );
    }

    return (
        <SettingsSection title="Completed Job History">
            <div className="space-y-2">
                {completedJobs.map(job => (
                    <div key={job.id} className="flex items-center p-3 rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full mr-3 shrink-0">
                            <i className="fas fa-check text-green-500"></i>
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold text-sm">{job.description.replace('Payout: ', '')}</p>
                            <p className="text-xs text-gray-500">{job.date}</p>
                        </div>
                        <p className="font-bold text-sm text-green-500">
                            +R {job.amount.toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </SettingsSection>
    );
};

const PreviousTalentsContent: React.FC<{ onViewImage: (url: string) => void }> = ({ onViewImage }) => {
    const navigate = useNavigate();
    const bookedTalentsTransactions = TRANSACTIONS.filter(tx => tx.amount < 0);

    const bookedTalents = useMemo(() => {
        return bookedTalentsTransactions.map(tx => {
            const talent = TALENTS.find(t => t.name === tx.talentName);
            return { tx, talent };
        }).filter(item => item.talent);
    }, [bookedTalentsTransactions]);

    if (bookedTalents.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-20">
                <i className="fas fa-users text-4xl mb-4"></i>
                <p>You haven't booked any talent yet.</p>
            </div>
        );
    }

    return (
        <SettingsSection title="Previously Booked Talent">
            <div className="space-y-1">
                {bookedTalents.map(({ tx, talent }) => (
                    <div key={tx.id} className="flex items-center p-3 rounded-lg">
                        <button onClick={(e) => { e.stopPropagation(); onViewImage(talent!.profileImage); }} className="shrink-0 mr-4">
                            <img src={talent!.profileImage} alt={talent!.name} className="w-12 h-12 rounded-full" />
                        </button>
                        <div onClick={() => navigate(`/talent/${talent!.id}`)} className="flex-grow cursor-pointer">
                            <p className="font-bold text-sm flex items-center">{talent!.name} {getVerificationIcon(talent!)}</p>
                            <p className="text-xs text-gray-500">{talent!.hustles[0]}</p>
                            <p className="text-xs text-gray-400 mt-1">{`Booked on ${tx.date}`}</p>
                        </div>
                        <button onClick={() => navigate(`/talent/${talent!.id}`)} className="text-gray-400">
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ))}
            </div>
        </SettingsSection>
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
                    <i className={`fas ${session.device.includes('iPhone') || session.device.includes('Samsung') ? 'fa-mobile-alt' : 'fa-desktop'} text-2xl w-8 text-center text-gray-500`}></i>
                    <div className="ml-3 flex-grow">
                        <p className="font-semibold text-sm">{session.device}</p>
                        <p className={`text-xs ${session.isCurrent ? 'text-green-500' : 'text-gray-500'}`}>{session.location}</p>
                    </div>
                    {session.isCurrent && (
                        <button className="text-gray-500 hover:text-black dark:hover:text-white"><i className="fas fa-ellipsis-v"></i></button>
                    )}
                </div>
            </div>
        ))}
    </SettingsSection>
);

const ChangePasswordContent: React.FC<{ user: User, onPasswordChanged: () => void }> = ({ user, onPasswordChanged }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validatePassword = (password: string): boolean => {
        // Simple validation for mock purposes
        return password.length >= 8;
    };

    const handleChangePassword = () => {
        setError(null);
        if (currentPassword !== user.password) {
            setError("Current password is incorrect.");
            return;
        }
        if (!validatePassword(newPassword)) {
            setError("New password must be at least 8 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        
        updateUserPassword(user.email, newPassword);
        onPasswordChanged();
    };

    return (
        <div className="space-y-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Your password must be at least 8 characters long and should be something others can't guess.
            </p>
            {error && <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900 p-2 rounded-lg">{error}</p>}
            <SettingsSection>
                <div className="p-4 space-y-4">
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3" />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3" />
                </div>
            </SettingsSection>
            <button
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className="mt-4 w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors disabled:opacity-50"
            >
                Change Password
            </button>
        </div>
    );
};

// --- Main Component ---

interface SettingsSubPageViewProps {
    user: User;
    onUpdateProfile: (updates: Partial<User>) => void;
    theme: 'light' | 'dark';
    onSetTheme: (theme: 'light' | 'dark') => void;
    themeAccent: ThemeAccent;
    onSetThemeAccent: (accent: ThemeAccent) => void;
}

const SettingsSubPageView: React.FC<SettingsSubPageViewProps> = ({ user, onUpdateProfile, theme, onSetTheme, themeAccent, onSetThemeAccent }) => {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for Identity Confirmation
    const [documentType, setDocumentType] = useState<'id' | 'passport'>('id');
    const [documentPhoto, setDocumentPhoto] = useState<string | null>(null);
    const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
    
    // State for image viewer in booking history
    const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

    const handleFileSelect = (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
        // A real app would use the camera API. Here we'll simulate an upload.
        // For simplicity, we use a static image URL.
        setter('https://picsum.photos/seed/doc1/400/250');
    };

    const handleSubscribe = (tier: 'premium' | 'blue') => {
        if (tier === 'premium') {
             onUpdateProfile({ isPremium: true, verificationTier: 'gold' });
        } else {
            onUpdateProfile({ verificationTier: 'blue' });
        }
        alert('Subscription successful!');
    };

    if (!pageId || !pageIdToTitle[pageId]) {
        return <Navigate to="/settings" replace />;
    }

    const renderContent = () => {
        switch(pageId) {
            case 'account-center': return <AccountCenterIndexContent user={user} />;
            case 'personal-details': return <PersonalDetailsContent user={user} onEditDob={() => alert('Edit DOB')} onEditPhone={() => alert('Edit Phone')} />;
            case 'identity-confirmation': return <IdentityConfirmationContent onSubscribeBlue={() => handleSubscribe('blue')} documentType={documentType} setDocumentType={setDocumentType} documentPhoto={documentPhoto} selfiePhoto={selfiePhoto} onDocumentPhotoClick={() => handleFileSelect(setDocumentPhoto)} onSelfiePhotoClick={() => handleFileSelect(setSelfiePhoto)} />;
            case 'password-and-security': return <PasswordAndSecurityContent />;
            case 'login-activity': return <LoginActivityContent />;
            case 'change-password': return <ChangePasswordContent user={user} onPasswordChanged={() => { alert('Password Changed!'); navigate('/settings/password-and-security'); }} />;
            case 'ad-preferences': return <AdPreferencesContent />;
            case 'job-history': return <PreviousJobsContent user={user} />;
            case 'booking-history': return <PreviousTalentsContent onViewImage={setViewerImageUrl}/>;
            case 'notifications': return <NotificationsContent user={user} />;
            case 'location': return <LocationContent user={user} />;
            case 'appearance': return <AppearanceContent theme={theme} onSetTheme={onSetTheme} themeAccent={themeAccent} onSetThemeAccent={onSetThemeAccent} />;
            case 'subscription': return <SubscriptionContent user={user} onSubscribe={() => handleSubscribe('premium')} />;
            case 'terms-of-use': return <TermsOfUseContent />;
            case 'privacy-policy': return <PrivacyPolicyContent />;
            case 'faq': return <FaqContent />;
            // Add cases for other pages here
            default: return <div>Coming soon...</div>;
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-black">
            <Header title={pageIdToTitle[pageId]} onBack={() => navigate(-1)} />
            <main className="flex-grow overflow-y-auto p-4">
                {renderContent()}
            </main>
            {viewerImageUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]" onClick={() => setViewerImageUrl(null)}>
                    <div className="relative max-w-full max-h-full p-4">
                        <img src={viewerImageUrl} alt="Profile" className="object-contain max-w-full max-h-[90vh] rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};

// Fix: Add default export for the component.
export default SettingsSubPageView;
