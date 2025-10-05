
import React, { useState, useRef, useMemo, useEffect } from 'react';
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
    'contact-info-visibility': 'Contact Info Visibility',
    'billing-details': 'Billing Details',
    'download-data': 'Download Your Data',
    'blocked-users': 'Blocked Users',
    'report-history': 'Report History',
    'ad-preferences': 'Ad Preferences',
    'job-history': 'Previous Jobs',
    'booking-history': 'Previous Talents',
    'change-password': 'Change Password',
    'saved-login-info': 'Saved Login Info',
    'two-factor-authentication': 'Two-Factor Authentication',
    '2fa-authenticator': 'Authenticator App Setup',
    '2fa-sms': 'SMS Verification Setup',
    'login-alerts': 'Login Alerts',
    'identity-confirmation': 'Identity Confirmation',
    'subscription': 'Book Me Premium',
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

const SettingsItem: React.FC<{ icon?: string; title: string; subtitle?: string; isLast?: boolean; onClick?: () => void; }> = ({ icon, title, subtitle, isLast, onClick }) => {
    const itemClasses = `flex items-center p-4 ${!isLast ? 'border-b border-gray-200 dark:border-gray-800' : ''} ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`;
    
    return (
        <div className={itemClasses} onClick={onClick}>
            {icon && (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg mr-4">
                    <i className={`fas ${icon} text-gray-600 dark:text-gray-300`}></i>
                </div>
            )}
            <div className="flex-grow">
                <p className="font-semibold">{title}</p>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
            {onClick && <div className="text-gray-400"><i className="fas fa-chevron-right"></i></div>}
        </div>
    );
};

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--accent-color)]"></div>
    </label>
);

const SuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4 text-center" onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check-circle text-4xl text-green-500"></i>
                </div>
                <h3 className="text-lg font-bold mb-2">Success!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Your changes have been saved successfully.</p>
                <button 
                    onClick={onClose} 
                    className="w-full border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white font-bold py-2 px-4 rounded-lg text-sm"
                >
                    OK
                </button>
            </div>
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

// --- Individual Page Components ---

const DeleteAccountModal: React.FC<{ onClose: () => void; onConfirm: () => void; }> = ({ onClose, onConfirm }) => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4 text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">This action is permanent and cannot be undone. All your data will be permanently removed.</p>
            <div className="mt-6 flex justify-center space-x-2">
                <button onClick={onClose} className="border border-gray-300 dark:border-gray-600 font-bold py-2 px-6 rounded-lg text-sm">Cancel</button>
                <button onClick={onConfirm} className="border bg-red-600 text-white font-bold py-2 px-6 rounded-lg text-sm">Yes, delete</button>
            </div>
        </div>
    </div>
);

const AccountCenterPage: React.FC<{ onLogout: () => void; user: User }> = ({ onLogout, user }) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(false);
        // In a real app, an API call would be made here to delete the user.
        alert("Account deletion initiated. You will now be logged out.");
        onLogout();
    };

    const historyPageId = user.role === UserRole.Talent ? 'job-history' : 'booking-history';

    return (
        <>
            <SettingsSection title="Profile & Portfolio">
                <SettingsItem title="Edit name, bio, rates, and location" onClick={() => navigate('/settings/personal-details')} />
                <SettingsItem title="Manage photos, videos, and reels" onClick={() => navigate('/profile')} />
                <SettingsItem title="Control visibility of your contact info" onClick={() => navigate('/settings/contact-info-visibility')} isLast />
            </SettingsSection>

            <SettingsSection title="Subscription & Billing (Premium)">
                <SettingsItem title="Upgrade to Premium or cancel" onClick={() => navigate('/settings/subscription')} />
                <SettingsItem title="View your billing cycle and payment method" onClick={() => navigate('/settings/billing-details')} />
                <SettingsItem title="Check your Premium status" subtitle="Gold Tick is granted to Premium members" onClick={() => navigate('/settings/subscription')} isLast />
            </SettingsSection>

            <SettingsSection title="Privacy & Data Controls">
                <SettingsItem title="Request or download your data" onClick={() => navigate('/settings/download-data')} />
                <SettingsItem title="Correct or delete personal info" onClick={() => navigate('/settings/personal-details')} />
                <SettingsItem title="Manage notifications and ads" onClick={() => navigate('/settings/ad-preferences')} />
                <SettingsItem title="Toggle location sharing" onClick={() => navigate('/settings/location')} />
                <SettingsItem title="Request permanent account deletion" onClick={() => setIsDeleteModalOpen(true)} isLast />
            </SettingsSection>
            
            <SettingsSection title="Security & Login">
                <SettingsItem title="Change your password" onClick={() => navigate('/settings/change-password')} />
                <SettingsItem title="Enable 2FA (if available)" onClick={() => navigate('/settings/two-factor-authentication')} />
                <SettingsItem title="Report unauthorized access" onClick={() => window.location.href = 'mailto:info@se-mogroup.com'} isLast />
            </SettingsSection>
            
            <SettingsSection title="Bookings & Transactions">
                <SettingsItem title="Review all bookings and messages" onClick={() => navigate('/messages')} />
                <SettingsItem title="Track past or upcoming jobs" onClick={() => navigate(`/settings/${historyPageId}`)} />
                <SettingsItem title="Access receipts and history" onClick={() => navigate(`/settings/${historyPageId}`)} />
                <SettingsItem title="Contact support for disputes or issues" onClick={() => window.location.href = 'mailto:info@se-mogroup.com'} isLast />
            </SettingsSection>
            
            <SettingsSection title="Reporting & Blocking">
                <SettingsItem title="View blocked users" onClick={() => navigate('/settings/blocked-users')} />
                <SettingsItem title="Monitor report history" onClick={() => navigate('/settings/report-history')} isLast />
            </SettingsSection>
            
            <SettingsSection title="Delete Account">
                <div onClick={() => setIsDeleteModalOpen(true)} className="p-4 text-red-500 cursor-pointer hover:bg-red-500/10 rounded-lg">
                    <p className="font-semibold">Delete your account</p>
                    <p className="text-xs">Cancel Premium subscriptions separately before deleting.</p>
                </div>
            </SettingsSection>

            <div className="text-center text-sm p-4 space-y-2">
                <p>For assistance:</p>
                <p>📧 <a href="mailto:info@se-mogroup.com" className="text-[var(--accent-color)] underline">info@se-mogroup.com</a></p>
                <p>🌐 <a href="http://www.se-mogroup.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] underline">www.se-mogroup.com</a></p>
            </div>

            {isDeleteModalOpen && <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteAccount} />}
        </>
    );
};

const PasswordAndSecurityPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <SettingsSection title="Login & recovery">
                <SettingsItem icon="fa-key" title="Change Password" onClick={() => navigate('/settings/change-password')} />
                <SettingsItem icon="fa-save" title="Saved Login Info" onClick={() => navigate('/settings/saved-login-info')} isLast />
            </SettingsSection>
            <SettingsSection title="Security">
                <SettingsItem icon="fa-user-check" title="Two-Factor Authentication" onClick={() => navigate('/settings/two-factor-authentication')} />
                <SettingsItem icon="fa-bell" title="Login Alerts" onClick={() => navigate('/settings/login-alerts')} isLast />
            </SettingsSection>
        </>
    );
};

const ChangePasswordPage: React.FC<{ user: User }> = ({ user }) => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const validatePassword = (password: string): boolean => {
        // Simple validation: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return regex.test(password);
    };

    const handleUpdatePassword = () => {
        setError(null);
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (currentPassword !== user.password) {
            setError('The current password you entered is incorrect.');
            return;
        }
        if (newPassword === currentPassword) {
            setError('The new password cannot be the same as the old password.');
            return;
        }
        if (!validatePassword(newPassword)) {
            setError('Password does not meet the security requirements.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('The new passwords do not match.');
            return;
        }

        // In a real app, this would be an API call.
        const success = updateUserPassword(user.email, newPassword);

        if (success) {
            setIsSuccessModalOpen(true);
            setTimeout(() => {
                setIsSuccessModalOpen(false);
                navigate('/settings/password-and-security');
            }, 1500);
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
    };
    
    return (
         <div className="space-y-4">
             {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
             <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
             <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
             <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
             <button onClick={handleUpdatePassword} className="w-full border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white font-bold py-2 px-4 rounded-lg text-sm">Update Password</button>
             {isSuccessModalOpen && <SuccessModal onClose={() => setIsSuccessModalOpen(false)} />}
         </div>
    );
};

const TwoFactorAuthPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <SettingsSection>
            <p className="p-4 text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account. We'll ask for a code if we notice a login from an unrecognized device or browser.</p>
            <div className="border-t border-gray-200 dark:border-gray-800">
                <SettingsItem icon="fa-mobile-alt" title="Authenticator App" subtitle="Recommended" onClick={() => navigate('/settings/2fa-authenticator')} />
                <SettingsItem icon="fa-comment" title="Text Message (SMS)" onClick={() => navigate('/settings/2fa-sms')} isLast />
            </div>
        </SettingsSection>
    );
};


const LoginActivityPage: React.FC = () => (
    <SettingsSection title="Where you're logged in">
        {LOGIN_SESSIONS.map((session, index) => (
            <div key={session.id} className={`p-4 ${index < LOGIN_SESSIONS.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
                <div className="flex items-center">
                    <i className={`fas ${session.device.includes('iPhone') || session.device.includes('Samsung') ? 'fa-mobile-alt' : 'fa-laptop'} text-2xl w-8 text-center mr-4`}></i>
                    <div className="flex-grow">
                        <p className="font-semibold">{session.device}</p>
                        <p className={`text-xs ${session.isCurrent ? 'text-green-500' : 'text-gray-500'}`}>{session.location}</p>
                    </div>
                    {!session.isCurrent && (
                        <button className="text-gray-500 text-xl"><i className="fas fa-ellipsis-v"></i></button>
                    )}
                </div>
            </div>
        ))}
    </SettingsSection>
);

const HistoryPage: React.FC<{ user: User }> = ({ user }) => {
    const isClient = user.role === UserRole.Client;
    const navigate = useNavigate();

    // Use a subset for display
    const transactions = isClient 
        ? TRANSACTIONS.filter(t => t.amount < 0).slice(0, 5)
        : TRANSACTIONS.filter(t => t.amount > 0).slice(0, 5);

    const talents = useMemo(() => {
        return [...new Set(transactions.map(t => t.talentName))].map(name => {
            const talent = TALENTS.find(t => t.name === name);
            const user = USERS.find(u => u.talentId === talent?.id);
            return { ...talent!, isPremium: user?.isPremium };
        });
    }, [transactions]);
    
    const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

    const renderItem = (item: Transaction | { name: string, profileImage: string, isPremium?: boolean }) => {
        if ('amount' in item) { // It's a job for a talent
            return (
                <div key={item.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm flex items-center">
                    <img src={item.talentProfileImage} alt={item.talentName} className="w-12 h-12 rounded-full mr-4" />
                    <div className="flex-grow">
                        <p className="font-bold">{item.description}</p>
                        <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span className="font-bold text-green-500">R {item.amount.toFixed(2)}</span>
                </div>
            );
        } else { // It's a talent for a client
            return (
                <div key={item.name} onClick={() => navigate(`/talent/${TALENTS.find(t=>t.name === item.name)?.id}`)} className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                     <button onClick={(e) => {e.stopPropagation(); setViewerImageUrl(item.profileImage)}} className="shrink-0 mr-4">
                        <img src={item.profileImage} alt={item.name} className="w-12 h-12 rounded-full" />
                    </button>
                    <div className="flex-grow">
                        <p className="font-bold flex items-center">{item.name} {getVerificationIcon(item)}</p>
                        <p className="text-sm text-gray-500">{TALENTS.find(t => t.name === item.name)?.hustles[0]}</p>
                    </div>
                     <span className="text-gray-400 text-sm"><i className="fas fa-chevron-right"></i></span>
                </div>
            )
        }
    };
    
    return (
        <div className="space-y-4 relative">
            {isClient
                ? talents.map(t => renderItem(t))
                : transactions.map(t => renderItem(t))
            }
            {viewerImageUrl && (
                 <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]" onClick={() => setViewerImageUrl(null)}>
                    <div className="relative max-w-full max-h-full p-4"><img src={viewerImageUrl} alt="Profile" className="object-contain max-w-full max-h-[90vh] rounded-lg" /></div>
                </div>
            )}
        </div>
    );
};

const SubscriptionPage: React.FC<{ user: User, onUpdateProfile: (updates: Partial<User>) => void }> = ({ user, onUpdateProfile }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    useEffect(() => {
        // Check if subscription has expired on component mount
        if (user.isPremium && user.subscriptionEndDate) {
            if (new Date(user.subscriptionEndDate) < new Date()) {
                onUpdateProfile({ isPremium: false, subscriptionEndDate: undefined });
            }
        }
    }, [user, onUpdateProfile]);

    const benefits = [
        { icon: "fa-ad", text: "Enjoy an ad-free experience" },
        { icon: "fa-gem", text: "Get a gold premium verification badge" },
        { icon: "fa-rocket", text: "Boosted visibility in search results" },
        { icon: "fa-headset", text: "Priority customer support" },
    ];
    
    const getSubscriptionStatus = () => {
        if (!user.isPremium || !user.subscriptionEndDate) {
            return { message: "Unlock exclusive features and enhance your experience.", renewalDays: null };
        }
        const endDate = new Date(user.subscriptionEndDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) {
            return {
                message: `Your premium access expires on ${endDate.toLocaleDateString()}. Renew now to keep your benefits.`,
                renewalDays: diffDays
            };
        }
        return {
            message: `Your premium access is active until ${endDate.toLocaleDateString()}.`,
            renewalDays: null
        };
    };

    const status = getSubscriptionStatus();

    return (
         <>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 text-center">
                {status.renewalDays !== null && (
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm mb-4">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Your subscription expires in {status.renewalDays} {status.renewalDays === 1 ? 'day' : 'days'}.
                    </div>
                )}
                <i className="fas fa-gem text-5xl text-yellow-500 mb-4"></i>
                <h3 className="text-2xl font-bold">Book Me Premium</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{status.message}</p>
                 <div className="text-left my-6 space-y-3">
                    {benefits.map(benefit => (
                         <div key={benefit.text} className="flex items-center">
                             <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                                <i className={`fas ${benefit.icon} text-gray-600 dark:text-gray-300`}></i>
                            </div>
                            <span>{benefit.text}</span>
                        </div>
                    ))}
                </div>
                {user.isPremium ? (
                     <button className="mt-4 w-full border-2 border-gray-300 dark:border-gray-600 font-bold py-3 rounded-lg text-sm">
                        Manage Subscription
                    </button>
                ) : (
                    <button onClick={() => setIsPaymentModalOpen(true)} className="mt-4 w-full border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white font-bold py-3 rounded-lg text-lg hover:opacity-90 transition-opacity">
                        Upgrade for R150.00 / month
                    </button>
                )}
            </div>
            {isPaymentModalOpen && (
                 <PaymentModal 
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSuccess={() => {
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 30);
                        onUpdateProfile({ isPremium: true, subscriptionEndDate: endDate.toISOString() });
                        setIsPaymentModalOpen(false);
                    }}
                 />
            )}
        </>
    );
};

const PaymentModal: React.FC<{ onClose: () => void, onSuccess: () => void }> = ({ onClose, onSuccess }) => {
    const [cardholder, setCardholder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCardNumber = (value: string) => {
        return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    };
    const formatExpiry = (value: string) => {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1 / $2').trim();
    };

    const handlePayment = () => {
        setError('');
        if (!cardholder || !cardNumber || !expiry || !cvc) {
            setError('All fields are required.');
            return;
        }
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            setError('Card number must be 16 digits.');
            return;
        }
        // Simulate payment failure
        if (cardNumber.endsWith('0000 ')) {
            setError('Payment failed. Please check your card details.');
            return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 2000);
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4 text-center">Enter Payment Details</h3>
                <div className="space-y-4">
                    <input type="text" placeholder="Cardholder Name" value={cardholder} onChange={e => setCardholder(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
                    <input type="text" placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
                    <div className="flex space-x-4">
                        <input type="text" placeholder="MM / YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} maxLength={7} className="w-1/2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
                        <input type="text" placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, ''))} maxLength={3} className="w-1/2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="border border-gray-300 dark:border-gray-600 font-bold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button onClick={handlePayment} disabled={isProcessing} className="border bg-[var(--accent-color)] text-white font-bold py-2 px-4 rounded-lg text-sm disabled:opacity-50 flex items-center justify-center min-w-[100px]">
                        {isProcessing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 'Pay R150.00'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const PrivacyPolicyPage: React.FC = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 text-sm text-gray-700 dark:text-gray-300 space-y-4">
        <p className="text-xs text-center text-gray-500">
            Powered by SE-MO Group (Pty) Ltd<br/>
            <strong>Effective Date:</strong> October 2025<br />
            <strong>Last Updated:</strong> October 5, 2025
        </p>
        
        <h3 className="font-bold text-lg text-black dark:text-white pt-2 text-center">🛡️ PRIVACY POLICY</h3>

        <h4 className="font-bold text-black dark:text-white pt-2">1. Introduction</h4>
        <p>At Book Me App, powered by SE-MO Group (Pty) Ltd, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our app, website, or related services (collectively, the “App”).</p>
        <p>By using Book Me App, you agree to this Privacy Policy. If you do not agree, please stop using the App.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">2. Information We Collect</h4>
        <p>We may collect the following types of data:</p>
        <h5 className="font-semibold text-black dark:text-white pl-2">2.1 Personal Information</h5>
        <ul className="list-disc list-inside pl-4">
            <li>Name, username, and password</li>
            <li>Email address or phone number</li>
            <li>Profile details (bio, category, city, and rates)</li>
            <li>Uploaded photos, videos, and reels</li>
        </ul>
        <h5 className="font-semibold text-black dark:text-white pl-2">2.2 Payment Information (for Premium Users)</h5>
        <ul className="list-disc list-inside pl-4">
            <li>Payment method details (via secure third-party processors)</li>
            <li>Subscription status and billing records</li>
            <li>We never store your full card details.</li>
        </ul>
         <h5 className="font-semibold text-black dark:text-white pl-2">2.3 Usage Data</h5>
        <ul className="list-disc list-inside pl-4">
            <li>App interactions (likes, comments, bookings, etc.)</li>
            <li>Ad views and engagement (for Free users)</li>
            <li>Device type, IP address, and session duration</li>
        </ul>
        <h5 className="font-semibold text-black dark:text-white pl-2">2.4 Optional Data</h5>
        <ul className="list-disc list-inside pl-4">
            <li>Location (for nearby searches)</li>
            <li>Notification and communication preferences</li>
        </ul>

        <h4 className="font-bold text-black dark:text-white pt-2">3. How We Use Your Information</h4>
        <p>Your data helps us to:</p>
        <ul className="list-disc list-inside pl-4">
            <li>Manage user accounts and profiles</li>
            <li>Facilitate bookings between clients and service providers</li>
            <li>Display posts, profiles, and reels</li>
            <li>Show relevant ads (for Free users)</li>
            <li>Manage Premium subscriptions and Gold Verification Tick</li>
            <li>Communicate updates and provide customer support</li>
            <li>Prevent fraud or misuse</li>
            <li>We do not sell your personal data.</li>
        </ul>

        <h4 className="font-bold text-black dark:text-white pt-2">4. Free vs. Premium Accounts</h4>
        <h5 className="font-semibold text-black dark:text-white pl-2">4.1 Free Users</h5>
        <ul className="list-disc list-inside pl-4">
            <li>Can use the app at no cost</li>
            <li>Will see ads in the app</li>
            <li>Ads are shown based on anonymous app usage data</li>
        </ul>
        <h5 className="font-semibold text-black dark:text-white pl-2">4.2 Premium Users</h5>
        <ul className="list-disc list-inside pl-4">
            <li>Pay R150/month</li>
            <li>Enjoy an ad-free experience</li>
            <li>Receive a Gold Verification Tick on their profile</li>
            <li>Appear higher in searches and gain premium visibility</li>
            <li>Can manage or cancel the subscription anytime in Settings → Upgrade to Premium</li>
        </ul>

        <h4 className="font-bold text-black dark:text-white pt-2">5. Sharing Information</h4>
        <p>Your data may be shared only when necessary:</p>
         <ul className="list-disc list-inside pl-4">
            <li>With other users (for public profiles and posts)</li>
            <li>With service providers (for hosting, payments, analytics)</li>
            <li>For legal reasons (if required by law or to protect users)</li>
            <li>All partners follow strict data protection agreements.</li>
        </ul>
        
        <h4 className="font-bold text-black dark:text-white pt-2">6. Advertising & Analytics</h4>
        <p>We use analytics tools to improve the app. Free users may see personalized or non-personalized ads. You can control ad preferences in your phone’s privacy settings.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">7. Data Security</h4>
        <p>We use encryption, secure logins, and verified payment systems to protect your data. However, no system is 100% secure—please keep your password private.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">8. Your Rights</h4>
        <p>You may:</p>
        <ul className="list-disc list-inside pl-4">
            <li>Access or update your data</li>
            <li>Request account deletion</li>
            <li>Withdraw marketing consent</li>
            <li>Report privacy concerns</li>
        </ul>
        <p>Contact us at <a href="mailto:info@se-mogroup.com" className="text-[var(--accent-color)] underline">info@se-mogroup.com</a> to exercise your rights.</p>
        
        <h4 className="font-bold text-black dark:text-white pt-2">9. Data Retention</h4>
        <p>We keep your data only as long as needed for services or legal obligations. When you delete your account, your personal data is permanently removed after a short retention period.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">10. Children’s Privacy</h4>
        <p>Book Me App is not intended for anyone under 16 years old. We do not knowingly collect their information.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">11. Third-Party Services</h4>
        <p>The app may integrate with other services (e.g., payment providers, YouTube, ad networks). Each has its own privacy policy—please review them.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">12. Policy Updates</h4>
        <p>We may update this Privacy Policy periodically. The latest version will always be posted on <a href="http://www.se-mogroup.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] underline">www.se-mogroup.com</a>.</p>
        
        <h4 className="font-bold text-black dark:text-white pt-2">13. Contact Us</h4>
        <p>For questions or concerns:</p>
        <p>📧 <a href="mailto:info@se-mogroup.com" className="text-[var(--accent-color)] underline">info@se-mogroup.com</a></p>
        <p>🌐 <a href="http://www.se-mogroup.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] underline">www.se-mogroup.com</a></p>
    </div>
);

const FaqPage: React.FC = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 text-sm text-gray-700 dark:text-gray-300 space-y-4">
        <h3 className="font-bold text-lg text-black dark:text-white pt-2 text-center">💬 FREQUENTLY ASKED QUESTIONS (FAQ)</h3>

        <h4 className="font-bold text-black dark:text-white pt-2">1. What is Book Me App?</h4>
        <p>Book Me App connects independent hustlers—artists, stylists, caterers, and more—with clients looking for their services.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">2. How do I create an account?</h4>
        <p>Sign up using email or phone number, choose your role (to get booked or to book someone), and complete your profile with photos, videos, and bio details.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">3. Is it free to use?</h4>
        <p>Yes! Book Me App is free. However, free users see ads. You can go Premium (R150/month) for an ad-free experience and a Gold Verification Tick.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">4. What is the Gold Tick?</h4>
        <p>The Gold Verification Tick is for Premium users — it verifies your status, removes ads, and boosts your visibility.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">5. How do I upgrade to Premium?</h4>
        <p>Go to Settings → Upgrade to Premium and follow the payment process. Your plan renews monthly.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">6. Can I cancel Premium?</h4>
        <p>Yes. You can cancel anytime in Settings. You’ll stay Premium until your current billing cycle ends.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">7. How do bookings work?</h4>
        <p>If you’re a client:</p>
        <ul className="list-disc list-inside pl-4">
            <li>Search by name, category, or location.</li>
            <li>View a provider’s profile.</li>
            <li>Send a booking request with date, time, and budget.</li>
        </ul>
        <p>If you’re a service provider, you can accept, reject, or chat about the booking.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">8. What if I’m scammed or someone doesn’t show up?</h4>
        <p>Use the Report or Block options immediately. Our team reviews reports and may suspend or remove users violating terms.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">9. Can I post videos or reels?</h4>
        <p>Yes! Upload videos or reels to show your work and attract clients. Reels appear in the Feed and can be liked, shared, or reposted.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">10. What services are allowed?</h4>
        <p>Any legal service, including:</p>
        <ul className="list-disc list-inside pl-4">
            <li>Music & entertainment</li>
            <li>Makeup & hair</li>
            <li>Photography & events</li>
            <li>Catering, decor, or creative freelancing</li>
        </ul>

        <h4 className="font-bold text-black dark:text-white pt-2">11. Can I block or report users?</h4>
        <p>Yes, tap Block or Report on any user’s profile to stop contact or flag misconduct.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">12. Are my details secure?</h4>
        <p>Yes, we protect your information with encryption and strict privacy measures. See our full Privacy Policy above.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">13. I forgot my password.</h4>
        <p>Tap “Forgot Password?” on the login screen to receive a reset link by email or SMS.</p>

        <h4 className="font-bold text-black dark:text-white pt-2">14. How do I contact support?</h4>
        <p>📧 <a href="mailto:info@se-mogroup.com" className="text-[var(--accent-color)] underline">info@se-mogroup.com</a></p>
        <p>🌐 <a href="http://www.se-mogroup.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] underline">www.se-mogroup.com</a></p>
        
        <h4 className="font-bold text-black dark:text-white pt-2">15. Who owns Book Me App?</h4>
        <p>Book Me App is developed and managed by SE-MO Group (Pty) Ltd, proudly based in South Africa, dedicated to empowering local hustlers and independent creators.</p>
        
        <div className="text-center text-xs text-gray-500 pt-4">
            <p>✅ End of Document</p>
            <p>© 2025 SE-MO Group (Pty) Ltd – All Rights Reserved.</p>
            <p>Book Me App is a registered digital platform under SE-MO Group.</p>
        </div>
    </div>
);

// --- Main View Component ---

interface SettingsSubPageViewProps {
    user: User;
    onUpdateProfile: (updates: Partial<User>) => void;
    onLogout: () => void;
}

const SettingsSubPageView: React.FC<SettingsSubPageViewProps> = ({ user, onUpdateProfile, onLogout }) => {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    if (!pageId || !pageIdToTitle[pageId]) {
        return <Navigate to="/settings" replace />;
    }

    const title = pageIdToTitle[pageId] || 'Settings';
    
    // Replace 'payouts' or 'payments' with relevant history page
    const historyPageId = user.role === UserRole.Talent ? 'job-history' : 'booking-history';
    if (pageId === 'payouts' || pageId === 'payments') {
        return <Navigate to={`/settings/${historyPageId}`} replace />;
    }
    
    const renderPageContent = () => {
        switch (pageId) {
            case 'account-center': return <AccountCenterPage onLogout={onLogout} user={user} />;
            case 'password-and-security': return <PasswordAndSecurityPage />;
            case 'login-activity': return <LoginActivityPage />;
            case 'job-history':
            case 'booking-history': return <HistoryPage user={user} />;
            case 'change-password': return <ChangePasswordPage user={user} />;
            case 'two-factor-authentication': return <TwoFactorAuthPage />;
            case 'subscription': return <SubscriptionPage user={user} onUpdateProfile={onUpdateProfile} />;
            case 'privacy-policy': return <PrivacyPolicyPage />;
            case 'faq': return <FaqPage />;
            // Add more cases for other pages here
            case 'personal-details':
            case 'contact-info-visibility':
            case 'billing-details':
            case 'download-data':
            case 'ad-preferences':
            case 'blocked-users':
            case 'report-history':
            case 'notifications':
            case 'location':
            case 'saved-login-info':
            case '2fa-authenticator':
            case '2fa-sms':
            case 'login-alerts':
            case 'identity-confirmation':
                return <p className="text-center text-gray-500">This page is under construction.</p>;
            default:
                return <p className="text-center text-gray-500">This page is under construction.</p>;
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-black">
            <Header title={title} onBack={() => navigate(-1)} />
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                {renderPageContent()}
            </div>
            {isSuccessModalOpen && <SuccessModal onClose={() => setIsSuccessModalOpen(false)} />}
        </div>
    );
};

export default SettingsSubPageView;
