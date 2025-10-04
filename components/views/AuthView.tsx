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

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>(AuthState.RoleSelection);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
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
              changeAuthState(AuthState.Login);
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
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
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
            <p className="text-center mt-12 text-sm text-gray-500">Don't have an account? <button onClick={() => changeAuthState(AuthState.Signup)} className="font-bold text-black dark:text-white hover:underline">Sign Up</button></p>
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
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="password" placeholder="Password" />
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="password" placeholder="Confirm Password" />
            <button onClick={handleSignupAttempt} className={primaryButtonClass}>Sign Up</button>
            <p className="text-center mt-6 text-sm text-gray-500">Already have an account? <button onClick={() => changeAuthState(AuthState.Login)} className="font-bold text-black dark:text-white hover:underline">Login</button></p>
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
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4" type="password" placeholder="New Password" />
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