
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, User } from '../../types';
import { findUserByEmail, addUser, findOrCreateUserByPhone, updateUserPassword } from '../../data/mockData';

enum AuthState {
  RoleSelection,
  Login,
  Signup,
  ForgotPassword,
  VerifyCode,
  ResetPassword,
  PhoneInput,
  PhoneVerify,
}

interface AuthViewProps {
  onLogin: (user: User, rememberMe: boolean) => void;
}

const secondaryButtonClass = "w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-lg text-lg mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
const primaryButtonClass = "w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg mb-4 hover:bg-[var(--accent-color)] hover:text-white transition-colors";

const TermsOfUseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg m-4 max-h-[85%] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <h3 className="text-lg font-bold">Terms of Use</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white text-xl w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 text-sm text-gray-700 dark:text-gray-300 space-y-4">
                <h4 className="font-bold text-lg text-black dark:text-white">Book Me App — Terms of Use</h4>
                <p className="text-xs text-gray-500">
                    <strong>Effective Date:</strong> October 2025<br />
                    <strong>Last Updated:</strong> October 5, 2025
                </p>
                <p>Welcome to Book Me App, a platform powered by SE-MO Group (Pty) Ltd, designed to connect independent creatives, service providers, and clients for easy and secure bookings. By accessing or using Book Me App (“the App,” “we,” “us,” or “our”), you agree to these Terms of Use (“Terms”).</p>
                <p>If you do not agree, please do not use the App.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">1. Overview</h5>
                <p>Book Me App allows users (“Users”) to:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Create profiles as Service Providers (artists, DJs, caterers, stylists, etc.) or Clients (those looking to book someone).</li>
                    <li>Share images, videos, posts, and reels.</li>
                    <li>Manage and receive bookings directly through the App.</li>
                    <li>Choose between Free (Ad-supported) or Premium (Ad-free) membership options.</li>
                </ul>
                <p>These Terms govern your use of all services, features, and content offered through the App.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">2. Eligibility</h5>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>You must be at least 16 years old to use Book Me App.</li>
                    <li>If you are using the App on behalf of a business or organization, you represent that you have the authority to bind that entity to these Terms.</li>
                </ul>

                <h5 className="font-bold text-black dark:text-white pt-2">3. Account Registration</h5>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>You may register using a valid email or phone number.</li>
                    <li>You agree to provide accurate and up-to-date information during registration.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>Book Me App is not responsible for any loss or damage resulting from unauthorized access to your account.</li>
                </ul>

                <h5 className="font-bold text-black dark:text-white pt-2">4. User Conduct</h5>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Post or share any illegal, harmful, or misleading content.</li>
                    <li>Impersonate another person or misrepresent your identity.</li>
                    <li>Use the platform for fraud, scams, or deceptive activities.</li>
                    <li>Harass, abuse, or threaten others.</li>
                    <li>Violate any applicable laws or regulations.</li>
                </ul>
                <p>We reserve the right to suspend or terminate accounts violating these rules.</p>
                
                <h5 className="font-bold text-black dark:text-white pt-2">5. Bookings and Payments</h5>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>All bookings and transactions are made directly between users.</li>
                    <li>SE-MO Group is not responsible for disputes, cancellations, or service quality.</li>
                    <li>Service Providers are solely responsible for the accuracy of their listings, pricing, and availability.</li>
                    <li>Clients are responsible for verifying the credentials and reliability of Service Providers before booking.</li>
                </ul>

                <h5 className="font-bold text-black dark:text-white pt-2">6. Free and Premium Memberships</h5>
                <p>Book Me App offers two types of user accounts:</p>
                <h6 className="font-semibold text-black dark:text-white pl-2">6.1 Free Users</h6>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Access all standard features of the App.</li>
                    <li>Experience in-app advertisements displayed during use.</li>
                    <li>May view sponsored content or partner promotions.</li>
                </ul>

                <h6 className="font-semibold text-black dark:text-white pl-2">6.2 Premium Users</h6>
                 <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Subscribe for R150 per month to enjoy an ad-free experience.</li>
                    <li>Premium users receive a special Gold Verification Tick, similar to Instagram’s verified badge but in gold, displayed on their profile to signify professional status.</li>
                    <li>Subscriptions can be managed in the Settings section under “Upgrade to Premium.”</li>
                    <li>Subscriptions automatically renew monthly unless canceled through your App Store or payment settings.</li>
                    <li>Fees are non-refundable except as required by law.</li>
                    <li>Book Me App reserves the right to adjust pricing or benefits for Premium accounts with prior notice.</li>
                </ul>
                
                <h5 className="font-bold text-black dark:text-white pt-2">7. Content Ownership</h5>
                 <p>You retain ownership of the content you post, but by uploading it, you grant Book Me App a non-exclusive, worldwide, royalty-free license to display, promote, and distribute your content within the App and its marketing materials.</p>
                 <p>You may delete your content at any time.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">8. Reporting, Blocking, and Safety</h5>
                <p>Users may report or block others for inappropriate behavior, scams, or misuse.</p>
                <p>Book Me App reserves the right to investigate and take action, including removal or suspension of accounts.</p>
                <p>However, we do not guarantee that all reported content will be immediately reviewed or removed.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">9. Privacy</h5>
                <p>Your privacy is important to us. Our data collection, use, and protection practices are outlined in our Privacy Policy (available on <a href="http://www.se-mogroup.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] underline">www.se-mogroup.com</a>).</p>

                <h5 className="font-bold text-black dark:text-white pt-2">10. Reels and Media Content</h5>
                <p>Users may upload videos (“Reels”) and photos to showcase their work or services. You are fully responsible for the content shared and must ensure it complies with our community guidelines and all applicable laws.</p>
                <p>We reserve the right to remove any content violating these Terms.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">11. Intellectual Property</h5>
                <p>All content, logos, trademarks, and software associated with Book Me App remain the property of SE-MO Group (Pty) Ltd. Unauthorized use, copying, or redistribution is strictly prohibited.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">12. Termination</h5>
                <p>We may suspend or terminate your access to the App if:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>You violate these Terms.</li>
                    <li>Your activity poses a security or legal risk.</li>
                    <li>Required by law or government order.</li>
                </ul>
                <p>You may delete your account at any time by contacting us at <a href="mailto:info@se-mogroup.com" className="text-[var(--accent-color)] underline">info@se-mogroup.com</a>.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">13. Disclaimer of Warranties</h5>
                <p>Book Me App is provided “as is” and “as available.” We make no warranties or guarantees about:</p>
                 <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>The accuracy or availability of any service listings.</li>
                    <li>The reliability of any user.</li>
                    <li>Continuous or error-free operation of the App.</li>
                </ul>
                <p>You use the App at your own risk.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">14. Limitation of Liability</h5>
                <p>SE-MO Group and its affiliates are not liable for any indirect, incidental, special, or consequential damages arising from your use of Book Me App, including loss of data, revenue, or reputation.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">15. Changes to Terms</h5>
                <p>We may update these Terms periodically. Continued use of the App after any changes constitutes your acceptance of the revised Terms.</p>

                <h5 className="font-bold text-black dark:text-white pt-2">16. Contact Us</h5>
                <p>For any questions or concerns regarding these Terms, please contact us at:</p>
                <p>📧 <a href="mailto:info@se-mogroup.com" className="text-[var(--accent-color)] underline">info@se-mogroup.com</a></p>
                <p>🌐 <a href="http://www.se-mogroup.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] underline">www.se-mogroup.com</a></p>

            </div>
        </div>
    </div>
);


const RoleSelectionScreen: React.FC<{ onSelect: (role: UserRole) => void }> = ({ onSelect }) => (
    <div className="w-full max-w-sm text-center">
        <h1 className="text-5xl font-bold text-center mb-4">Book Me</h1>
        <div className="relative text-center mt-2 mb-8 h-8">
            <p className="text-gray-500 dark:text-gray-400 animate-bounce-in" style={{ animationDelay: '200ms' }}>
                Connecting Talent & Clients
            </p>
            <i className="fas fa-star text-yellow-400 text-xs sparkle-star" style={{ top: '-10px', left: '10%', animationDelay: '0.5s' }}></i>
            <i className="fas fa-star text-yellow-400 text-xs sparkle-star" style={{ top: '5px', left: '85%', animationDelay: '0.8s' }}></i>
            <i className="fas fa-star text-yellow-400 text-xs sparkle-star" style={{ top: '15px', left: '20%', animationDelay: '1.1s' }}></i>
            <i className="fas fa-star text-yellow-400 text-xs sparkle-star" style={{ top: '-5px', left: '70%', animationDelay: '1.3s' }}></i>
        </div>
        <button onClick={() => onSelect(UserRole.Talent)} className={secondaryButtonClass}>I'm a Talent</button>
        <button onClick={() => onSelect(UserRole.Client)} className={secondaryButtonClass}>I'm Booking</button>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-12">se-mo Group</p>
    </div>
);


const ProgressIndicator: React.FC<{ step: number }> = ({ step }) => (
    <div className="flex items-center space-x-2 w-full max-w-sm mb-6 shrink-0">
        <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center text-xs">1</div>
            <span className="text-xs font-semibold">Role</span>
        </div>
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
        <div className={`flex items-center space-x-1 transition-colors ${step >= 2 ? 'text-black dark:text-white' : 'text-gray-400'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${step >= 2 ? 'bg-[var(--accent-color)] text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>2</div>
            <span className="text-xs font-semibold">Details</span>
        </div>
    </div>
);

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
};

const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) return "Password must contain at least one special character.";
    return null;
};

const PasswordRequirements: React.FC<{password: string}> = ({ password }) => {
    const checks = [
        { regex: /.{8,}/, text: "At least 8 characters" },
        { regex: /[a-z]/, text: "One lowercase letter" },
        { regex: /[A-Z]/, text: "One uppercase letter" },
        { regex: /[0-9]/, text: "One number" },
        { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, text: "One special character" },
    ];

    return (
        <div className="text-xs space-y-1.5 my-3 px-1">
            {checks.map((check, i) => (
                <div key={i} className={`flex items-center transition-colors ${check.regex.test(password) ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    <i className={`fas ${check.regex.test(password) ? 'fa-check-circle' : 'fa-times-circle'} mr-2 w-4 text-center`}></i>
                    <span>{check.text}</span>
                </div>
            ))}
        </div>
    );
};


const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>(AuthState.RoleSelection);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isRoleSelected = authState !== AuthState.RoleSelection;

  const resetFormState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhoneNumber('');
    setVerificationCode('');
    setError(null);
    setSuccessMessage(null);
  };

  const changeAuthState = (newState: AuthState, options: { keepEmail?: boolean, successMessage?: string } = {}) => {
    const currentEmail = email;
    resetFormState();
    if (options.keepEmail) setEmail(currentEmail);
    if (options.successMessage) setSuccessMessage(options.successMessage);
    setAuthState(newState);
  };
  
  const handleBack = () => {
      switch(authState) {
          case AuthState.Login:
          case AuthState.Signup:
          case AuthState.PhoneInput:
              changeAuthState(AuthState.RoleSelection);
              break;
          case AuthState.ForgotPassword:
          case AuthState.VerifyCode:
          case AuthState.ResetPassword:
              changeAuthState(AuthState.Login, { keepEmail: true });
              break;
          case AuthState.PhoneVerify:
              changeAuthState(AuthState.PhoneInput);
              break;
      }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    changeAuthState(AuthState.Login);
  };

  const handleLoginAttempt = () => {
    setError(null);
    if (!email || !password) {
        setError('Please fill in all fields.');
        return;
    }
    if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    const user = findUserByEmail(email);
    if (!user) {
        setError('No account found with this email. Please sign up.');
        return;
    }
    if (user.role !== selectedRole) {
        setError(`You are trying to log in as a ${selectedRole}, but this account is registered as a ${user.role}.`);
        return;
    }
    if (user.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
    }
    onLogin(user, rememberMe);
    navigate('/');
  };

  const handleSignupAttempt = () => {
    setError(null);
    if (!fullName || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
    }
    if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
        setError(passwordError);
        return;
    }
    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }
    const newUser: User = {
        id: '', name: fullName, email, password, role: selectedRole!,
        username: '',
        profileImage: '', bio: '', postsCount: 0, followersCount: 0, followingCount: 0,
    };
    const createdUser = addUser(newUser);
    if (!createdUser) {
        setError('An account with this email already exists.');
        return;
    }
    changeAuthState(AuthState.Login, {
        keepEmail: true,
        successMessage: "Registration successful! Please log in."
    });
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
     setError(null);
     if (!selectedRole) {
        setError("Please select a role first.");
        changeAuthState(AuthState.RoleSelection);
        return;
    }
    // Simulate finding different users for different roles/providers
    let emailToFind = '';
    if (selectedRole === UserRole.Talent) {
        emailToFind = 'talent@book.me';
    } else {
        emailToFind = provider === 'google' ? 'john.s@email.com' : 'client@book.me';
    }
    const user = findUserByEmail(emailToFind);
    if (user) {
        onLogin(user, true);
        navigate('/');
    } else {
        setError(`Could not log you in with ${provider}. Please try again.`);
    }
  };

  const handleSendPhoneCode = () => {
    setError(null);
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
        setError("Please enter a valid phone number.");
        return;
    }
    changeAuthState(AuthState.PhoneVerify);
  };

 const handleVerifyPhoneCode = () => {
    setError(null);
    if (verificationCode !== '123456') {
        setError("Invalid verification code. Please try again.");
        return;
    }
    if (!selectedRole) {
        changeAuthState(AuthState.RoleSelection);
        return;
    }
    const user = findOrCreateUserByPhone(phoneNumber, selectedRole);
    if (user.role !== selectedRole) {
        setError(`An account with this phone number exists as a ${user.role}. Please log in with the correct role.`);
        return;
    }
    onLogin(user, true);
    navigate('/');
  };

  const handleForgotPassword = () => {
    setError(null);
    if (!email.trim()) {
        setError("Please enter your email address.");
        return;
    }
    if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    const user = findUserByEmail(email);
    if (!user) {
        setError("No account found with this email address.");
        return;
    }
    // In a real app, you would send an email here.
    changeAuthState(AuthState.VerifyCode, { 
        keepEmail: true, 
        successMessage: "A verification code has been sent to your email." 
    });
};

const handleVerifyResetCode = () => {
    setError(null);
    if (verificationCode !== '123456') {
        setError("Invalid verification code. Please try again.");
        return;
    }
    changeAuthState(AuthState.ResetPassword, { keepEmail: true });
};

const handleResetPassword = () => {
    setError(null);
    if (!password || !confirmPassword) {
        setError("Please fill in both password fields.");
        return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
        setError(passwordError);
        return;
    }
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    
    const success = updateUserPassword(email, password);
    if (success) {
        changeAuthState(AuthState.Login, { 
            keepEmail: true, 
            successMessage: "Password reset successfully! Please log in with your new password."
        });
    } else {
        // This case should theoretically not happen if email was validated before
        setError("An error occurred. Could not find user to update.");
    }
};

  const renderFormContent = () => {
    const errorDisplay = error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>;
    const successDisplay = successMessage && <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>;

    switch (authState) {
      case AuthState.Login:
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-center mb-1">Welcome Back!</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Login as a {selectedRole}</p>
            {errorDisplay}{successDisplay}
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="email" placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="password" placeholder="Password" />
            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[var(--accent-color)] focus:ring-[var(--accent-color)]" />
                <span className="ml-2">Remember me</span>
              </label>
              <button onClick={() => changeAuthState(AuthState.ForgotPassword, { keepEmail: true })} className="text-sm text-gray-500 hover:underline">Forgot Password?</button>
            </div>
            <button onClick={handleLoginAttempt} className={primaryButtonClass}>Login</button>
            <p className="text-center text-xs text-gray-400 mt-6">
                By logging in, you agree to our <button onClick={() => setIsTermsModalOpen(true)} className="font-semibold underline hover:text-black dark:hover:text-white">Terms of Use</button>.
            </p>
            <p className="text-center mt-4 text-sm text-gray-500">Don't have an account? <button onClick={() => changeAuthState(AuthState.Signup, { keepEmail: true })} className="font-bold text-black dark:text-white hover:underline">Sign Up</button></p>
          </div>
        );
      case AuthState.Signup:
         return (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Sign up as a {selectedRole}</p>
            {errorDisplay}
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="text" placeholder="Full Name" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="email" placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3" type="password" placeholder="Password" />
            <PasswordRequirements password={password} />
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="password" placeholder="Confirm Password" />
            <button onClick={handleSignupAttempt} className={primaryButtonClass}>Sign Up</button>
             <p className="text-center text-xs text-gray-400 mt-6">
                By signing up, you agree to our <button onClick={() => setIsTermsModalOpen(true)} className="font-semibold underline hover:text-black dark:hover:text-white">Terms of Use</button>.
            </p>
            <p className="text-center mt-4 text-sm text-gray-500">Already have an account? <button onClick={() => changeAuthState(AuthState.Login, { keepEmail: true })} className="font-bold text-black dark:text-white hover:underline">Login</button></p>
          </div>
        );
      case AuthState.PhoneInput:
        return (
            <>
                <h2 className="text-2xl font-bold text-center mb-2">Enter Phone Number</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Continue as a {selectedRole}</p>
                {errorDisplay}
                <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="tel" placeholder="+27 82 123 4567" />
                <button onClick={handleSendPhoneCode} className={primaryButtonClass}>Send Code</button>
            </>
        );
       case AuthState.PhoneVerify:
        return (
            <>
                <h2 className="text-2xl font-bold text-center mb-2">Enter Verification Code</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">A 6-digit code was sent to {phoneNumber}.</p>
                {errorDisplay}
                <input value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4 text-center tracking-[1em]" maxLength={6} placeholder="______" />
                <p className="text-center text-xs text-gray-400 mb-4">Mock code: 123456</p>
                <button onClick={handleVerifyPhoneCode} className={primaryButtonClass}>Verify & Continue</button>
            </>
        );
      case AuthState.ForgotPassword:
        return (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Forgot Password?</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Enter your email to receive a verification code.</p>
            {errorDisplay}
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="email" placeholder="Email Address" />
            <button onClick={handleForgotPassword} className={primaryButtonClass}>Send Code</button>
          </>
        );
      case AuthState.VerifyCode:
        return (
            <>
                <h2 className="text-2xl font-bold text-center mb-2">Enter Verification Code</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">A 6-digit code was sent to {email}.</p>
                {errorDisplay}{successDisplay}
                <input value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4 text-center tracking-[1em]" maxLength={6} placeholder="______" />
                <p className="text-center text-xs text-gray-400 mb-4">Mock code: 123456</p>
                <button onClick={handleVerifyResetCode} className={primaryButtonClass}>Verify & Continue</button>
            </>
        );
      case AuthState.ResetPassword:
        return (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Create a new strong password for your account.</p>
            {errorDisplay}
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3" type="password" placeholder="New Password" />
            <PasswordRequirements password={password} />
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="password" placeholder="Confirm New Password" />
            <button onClick={handleResetPassword} className={primaryButtonClass}>Reset Password</button>
          </>
        );
      default:
        return null;
    }
  };
  
  const showProgress = authState === AuthState.Signup || authState === AuthState.PhoneInput || authState === AuthState.PhoneVerify;

  return (
    <div className="h-full relative overflow-hidden">
        {isTermsModalOpen && <TermsOfUseModal onClose={() => setIsTermsModalOpen(false)} />}
        <div 
            className="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${isRoleSelected ? '-50%' : '0%'})` }}
        >
            {/* Pane 1: Role Selection */}
            <div className="w-1/2 h-full flex items-center justify-center p-6">
                <RoleSelectionScreen onSelect={handleRoleSelect} />
            </div>

            {/* Pane 2: Login/Signup/etc. */}
            <div className="w-1/2 h-full flex flex-col items-center justify-center p-6 relative">
                 <button onClick={handleBack} className="absolute top-16 left-6 text-xl p-2 text-gray-500 hover:text-black dark:hover:text-white z-10" aria-label="Go back">
                    <i className="fas fa-arrow-left"></i>
                </button>
                {showProgress && <ProgressIndicator step={authState >= AuthState.PhoneInput ? 3 : 2} />}
                <div className="w-full max-w-sm flex-grow flex items-center justify-center">
                    <div key={authState} className="w-full animate-fade-in">
                        {renderFormContent()}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AuthView;