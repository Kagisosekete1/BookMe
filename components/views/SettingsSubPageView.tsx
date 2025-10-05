import React, { useState, useRef, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { User, LoginSession, Transaction, UserRole, ThemeAccent } from '../../types';
import { LOGIN_SESSIONS, TRANSACTIONS, TALENTS, updateUserPassword } from '../../data/mockData';

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
    if (userOrTalent.verificationTier) {
        const color = userOrTalent.verificationTier === 'gold' ? 'text-yellow-400' : 'text-blue-500';
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

const ChangePasswordContent: React.FC<{ user: User }> = ({ user }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleUpdate = () => {
        setError(null);
        setSuccess(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (currentPassword !== user.password) {
            setError('Incorrect current password.');
            return;
        }
        if (newPassword.length < 8) {
             setError('New password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (newPassword === currentPassword) {
            setError('New password cannot be the same as the old password.');
            return;
        }
        
        const success = updateUserPassword(user.email, newPassword);
        if (success) {
            setSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } else {
             setError('Could not update password. Please try again.');
        }
    };

    return (
        <div className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center p-3 bg-red-100 dark:bg-red-900/50 rounded-lg animate-fade-in">{error}</div>}
            {success && <div className="text-green-500 text-sm text-center p-3 bg-green-100 dark:bg-green-900/50 rounded-lg animate-fade-in">{success}</div>}
            <input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3" type="password" placeholder="Current Password" />
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3" type="password" placeholder="New Password" />
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3" type="password" placeholder="Re-type New Password" />
            <button onClick={handleUpdate} className="w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors">Update Password</button>
        </div>
    );
};


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

const TwoFactorAuthContent: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <div className="text-center">
                 <i className="fas fa-user-shield text-4xl text-blue-500 mb-3"></i>
                 <p className="text-gray-600 dark:text-gray-400">Two-factor authentication is an enhanced security feature. Once enabled, Book Me will require a login code in addition to your password.</p>
            </div>
            <SettingsSection title="Select a Security Method">
                 <SettingsItem icon="fa-mobile-alt" title="Authenticator App (Recommended)" subtitle="Get a verification code from an app like Google Authenticator or Duo." onClick={() => navigate('/settings/2fa-authenticator')} />
                 <SettingsItem icon="fa-comment-dots" title="Text Message (SMS)" subtitle="We'll text a code to your mobile number." isLast onClick={() => navigate('/settings/2fa-sms')} />
            </SettingsSection>
        </div>
    );
};

const AuthenticatorAppSetupContent: React.FC = () => (
    <div className="space-y-6">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Use an authenticator app like Google Authenticator to scan the QR code. Enter the 6-digit code generated by your app to complete setup.</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/BookMe:user@book.me?secret=JBSWY3DPEHPK3PXP&issuer=BookMe" alt="QR Code" className="rounded-md" />
        </div>
        <SettingsSection title="Or enter setup key manually">
            <div className="p-4">
                <p className="text-center font-mono tracking-widest bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">JBSW Y3DP EHPK 3PXP</p>
            </div>
        </SettingsSection>
        <div className="space-y-2">
            <input className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center tracking-[0.5em]" maxLength={6} placeholder="123456" />
            <button className="w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors">Verify & Activate</button>
        </div>
    </div>
);

const SmsSetupContent: React.FC<{ user: User }> = ({ user }) => (
    <div className="space-y-6">
         <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>We will send a verification code to your phone number to complete the setup.</p>
        </div>
        <SettingsSection>
            <div className="p-4">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                 <input type="tel" defaultValue={user.phoneNumber || ''} placeholder="+27 82 123 4567" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
            </div>
        </SettingsSection>
        <div className="space-y-2">
            <button className="w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors">Send Code</button>
        </div>
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

const ImageViewerModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]" onClick={onClose}>
        <div className="relative max-w-full max-h-full p-4">
            <img src={imageUrl} alt="Profile" className="object-contain max-w-full max-h-[90vh] rounded-lg" />
        </div>
    </div>
);


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
    const navigate = useNavigate();
    const [isDobModalOpen, setIsDobModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [isBlueBadgeModalOpen, setIsBlueBadgeModalOpen] = useState(false);
    const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

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

    const title = pageIdToTitle[pageId];

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
            case 'job-history':
                return <PreviousJobsContent user={user} />;
            case 'booking-history':
                return <PreviousTalentsContent onViewImage={setViewerImageUrl} />;
            case 'change-password':
                return <ChangePasswordContent user={user} />;
            case 'saved-login-info':
                return <SavedLoginInfoContent />;
            case 'two-factor-authentication':
                return <TwoFactorAuthContent />;
            case '2fa-authenticator':
                return <AuthenticatorAppSetupContent />;
            case '2fa-sms':
                return <SmsSetupContent user={user} />;
            case 'login-alerts':
                return <LoginAlertsContent />;
            case 'subscription':
                return <SubscriptionContent user={user} onSubscribe={() => onUpdateProfile({ isPremium: true })} />;
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
        <div className="h-full flex flex-col bg-gray-50 dark:bg-black">
            <Header title={title} onBack={() => navigate(-1)} />
            <div className="flex-grow overflow-y-auto p-4 relative">
                {renderContent()}
            </div>
            {isDobModalOpen && <EditDateOfBirthModal onClose={() => setIsDobModalOpen(false)} />}
            {isPhoneModalOpen && <EditPhoneNumberModal user={user} onClose={() => setIsPhoneModalOpen(false)} onUpdateProfile={onUpdateProfile} />}
            {isBlueBadgeModalOpen && <BlueBadgeSubscriptionModal onClose={() => setIsBlueBadgeModalOpen(false)} />}
            {viewerImageUrl && <ImageViewerModal imageUrl={viewerImageUrl} onClose={() => setViewerImageUrl(null)} />}
        </div>
    );
};

export default SettingsSubPageView;