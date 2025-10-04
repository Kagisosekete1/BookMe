import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Post, Reel, UserRole, Comment as CommentType } from '../../types';
import { getPostsByTalentId, getReelsByTalentId, getTalentById, addCommentToPost, getTalentByPost, TALENTS } from '../../data/mockData';

const getVerificationIcon = (tier?: 'gold' | 'blue') => {
    if (!tier) return null;
    const color = tier === 'gold' ? 'text-yellow-500' : 'text-blue-500';
    return <i className={`fas fa-star ${color} ml-1.5 text-xs`}></i>;
};

// --- Modals and Sub-components ---

interface PostDetailModalProps {
    post: Post;
    currentUser: User;
    onClose: () => void;
    onPostUpdate: (updatedPost: Post) => void;
    onPrev: () => void;
    onNext: () => void;
    currentIndex: number;
    totalPosts: number;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, currentUser, onClose, onPostUpdate, onPrev, onNext, currentIndex, totalPosts }) => {
    const talent = getTalentByPost(post);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: CommentType = {
            id: `c${Date.now()}`,
            user: currentUser.name,
            userId: currentUser.id,
            profileImage: currentUser.profileImage,
            text: newComment.trim(),
        };

        addCommentToPost(post.id, comment);
        onPostUpdate({ ...post }); // The `post` prop is mutated, create new obj ref to trigger re-render
        setNewComment('');
    };

    if (!talent) return null;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
            {/* Prev Button */}
            {currentIndex > 0 && (
                 <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-opacity-75">
                    <i className="fas fa-chevron-left"></i>
                </button>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col m-4 relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
                    <img src={talent.profileImage} alt={talent.name} className="w-10 h-10 rounded-full mr-3" />
                    <p className="font-bold flex-grow">{talent.name}</p>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="w-full h-auto" />}
                    <div className="p-4">
                        <p className="mb-4 text-sm">{post.text}</p>
                        <div className="flex justify-start items-center text-gray-500 dark:text-gray-400 border-t border-b border-gray-200 dark:border-gray-700 py-2 space-x-8">
                             <button onClick={() => { setIsLiked(!isLiked); setLikeCount(p => isLiked ? p - 1 : p + 1); }} className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                                <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i><span>{likeCount}</span>
                            </button>
                            <div className="flex items-center space-x-2"><i className="far fa-comment"></i><span>{post.comments.length}</span></div>
                        </div>
                    </div>
                    <div className="px-4 pb-4 space-y-4">
                         {post.comments.map(comment => {
                            const isTalentCommenter = TALENTS.some(t => t.id === comment.userId);
                            return (
                                <div key={comment.id} className="flex items-start space-x-3">
                                    <Link to={`/talent/${comment.userId}`} onClick={onClose} className={!isTalentCommenter ? 'pointer-events-none' : ''}>
                                        <img src={comment.profileImage} alt={comment.user} className="w-8 h-8 rounded-full" />
                                    </Link>
                                    <div><p><Link to={`/talent/${comment.userId}`} onClick={onClose} className={`font-bold text-sm hover:underline ${!isTalentCommenter ? 'pointer-events-none' : ''}`}>{comment.user}</Link>{' '}<span className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</span></p></div>
                                </div>
                            );
                         })}
                    </div>
                </div>

                <div className="p-2 border-t border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center space-x-2">
                        <img src={currentUser.profileImage} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                        <input type="text" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddComment()} className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 px-4 outline-none" />
                        <button onClick={handleAddComment} className="font-semibold text-[var(--accent-color)] hover:opacity-80 disabled:opacity-50" disabled={!newComment.trim()}>Post</button>
                    </div>
                </div>
            </div>
            
            {/* Next Button */}
            {currentIndex < totalPosts - 1 && (
                <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-opacity-75">
                    <i className="fas fa-chevron-right"></i>
                </button>
            )}
        </div>
    );
};

interface ImageCropModalProps {
    imageSrc: string;
    onClose: () => void;
    onSave: (image: string) => void;
}
const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageSrc, onClose, onSave }) => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]" onClick={onClose}>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-center">Position and Save</h3>
            <div className="w-full aspect-square rounded-full overflow-hidden mx-auto bg-gray-200 dark:bg-gray-700">
                <img src={imageSrc} alt="Crop preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">This is a preview. Final image will be saved.</p>
             <div className="mt-6 flex justify-end space-x-2">
                <button onClick={onClose} className="border border-gray-300 dark:border-gray-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button onClick={() => onSave(imageSrc)} className="border border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-2 px-4 rounded-lg text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">Use Photo</button>
            </div>
        </div>
    </div>
);

const InputWithCounter: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; 
    maxLength: number; 
    isTextArea?: boolean; 
    placeholder?: string; 
}> = ({ label, value, onChange, maxLength, isTextArea, placeholder }) => {
    const getCounterColor = () => {
        if (value.length > maxLength) return 'text-red-500';
        if (value.length > maxLength - 10) return 'text-orange-500';
        return 'text-gray-400';
    };
    return (
        <div>
            <div className="flex justify-between items-center"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label><span className={`text-xs font-semibold transition-colors ${getCounterColor()}`}>{value.length}/{maxLength}</span></div>
            {isTextArea ? (<textarea rows={4} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"/>) : (<input type="text" value={value} onChange={onChange} placeholder={placeholder} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"/>)}
        </div>
    );
};

interface EditProfileModalProps {
    currentUser: User;
    onUpdateProfile: (updates: Partial<User>) => void;
    onClose: () => void;
}
const EditProfileModal: React.FC<EditProfileModalProps> = ({ currentUser, onUpdateProfile, onClose }) => {
    const [name, setName] = useState(currentUser.name);
    const [username, setUsername] = useState(currentUser.username);
    const [bio, setBio] = useState(currentUser.bio);
    const [profession, setProfession] = useState(currentUser.profession || '');
    const [profileImage, setProfileImage] = useState(currentUser.profileImage);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const MAX_SIZE_MB = 2;
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                alert(`File is too large! Please upload an image under ${MAX_SIZE_MB}MB.`);
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageToCrop(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onUpdateProfile({ name, username, bio, profession, profileImage });
        onClose();
    };
    
    const isSaveDisabled = name.length > 20 || username.length > 30 || bio.length > 200 || profession.length > 50 || name.length === 0 || username.length === 0;

    return (
        <>
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <h3 className="text-lg font-bold mb-4 text-center">Edit Profile</h3>
                    <div className="flex justify-center mb-4"><div className="relative"><img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" /><input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" /><button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white dark:border-gray-900"><i className="fas fa-camera"></i></button></div></div>
                    <div className="space-y-4">
                        <InputWithCounter label="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} />
                        <InputWithCounter label="Username" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={30} />
                        <InputWithCounter label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} isTextArea />
                        {currentUser.role === UserRole.Talent && (<InputWithCounter label="Profession" value={profession} onChange={(e) => setProfession(e.target.value)} maxLength={50} placeholder="e.g., DJ, Photographer"/>)}
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button onClick={onClose} className="border border-gray-300 dark:border-gray-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={isSaveDisabled} className="border border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-2 px-4 rounded-lg text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
                    </div>
                </div>
            </div>
            {imageToCrop && <ImageCropModal imageSrc={imageToCrop} onClose={() => setImageToCrop(null)} onSave={(img) => { setProfileImage(img); setImageToCrop(null); }}/>}
        </>
    );
};

// --- Main Profile View Component ---

interface ProfileViewProps {
    currentUser: User;
    onUpdateProfile: (updates: Partial<User>) => void;
}
const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onUpdateProfile }) => {
    const [activeTab, setActiveTab] = useState<'grid' | 'tagged'>('grid');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
    
    const userPosts = getPostsByTalentId(currentUser.talentId) || [];
    const talent = getTalentById(currentUser.talentId);

    const handlePostClick = (post: Post, index: number) => {
        setSelectedPost(post);
        setSelectedPostIndex(index);
    };

    const handleNextPost = () => {
        if (selectedPostIndex !== null && selectedPostIndex < userPosts.length - 1) {
            const nextIndex = selectedPostIndex + 1;
            setSelectedPostIndex(nextIndex);
            setSelectedPost(userPosts[nextIndex]);
        }
    };
    const handlePrevPost = () => {
        if (selectedPostIndex !== null && selectedPostIndex > 0) {
            const prevIndex = selectedPostIndex - 1;
            setSelectedPostIndex(prevIndex);
            setSelectedPost(userPosts[prevIndex]);
        }
    };

    return (
        <div className="h-full flex flex-col relative">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
                 <div className="flex items-center justify-between mb-4 pt-12"><p className="text-xl font-bold">@{currentUser.username}</p><div className="flex items-center space-x-4"><Link to="/settings" className="text-2xl"><i className="fas fa-bars"></i></Link></div></div>
                <div className="flex items-center mt-4"><img src={currentUser.profileImage} alt={currentUser.name} className="w-20 h-20 rounded-full" /><div className="flex flex-grow justify-around text-center">{currentUser.role === UserRole.Talent && talent ? (<><div><p className="font-bold text-lg">{userPosts.length}</p><p className="text-sm text-gray-500">Posts</p></div><div><p className="font-bold text-lg">{talent.reviewsCount}</p><p className="text-sm text-gray-500">Jobs</p></div><div><p className="font-bold text-lg flex items-center justify-center"><i className="fas fa-star text-yellow-500 mr-1"></i>{talent.rating.toFixed(1)}</p><p className="text-sm text-gray-500">Ratings</p></div></>) : (<><div><p className="font-bold text-lg">{currentUser.followersCount}</p><p className="text-sm text-gray-500">Booked</p></div><div><p className="font-bold text-lg flex items-center justify-center"><i className="fas fa-star text-yellow-500 mr-1"></i>4.5</p><p className="text-sm text-gray-500">Ratings</p></div></>)}</div></div>
                <div className="mt-4"><p className="font-bold text-sm flex items-center">{currentUser.name}{currentUser.role === UserRole.Talent && getVerificationIcon(talent?.verificationTier)}</p>{currentUser.role === UserRole.Talent && currentUser.profession && (<p className="text-xs text-gray-500">{currentUser.profession}</p>)}<p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-1">{currentUser.bio}</p></div>
                <div className="flex mt-4 space-x-2"><button onClick={() => setIsEditModalOpen(true)} className="w-full border-2 border-gray-300 dark:border-gray-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Edit Profile</button></div>
            </div>
            <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0">
                <button onClick={() => setActiveTab('grid')} className={`flex-1 text-center py-3 text-2xl ${activeTab === 'grid' ? 'border-b-2 text-black dark:text-white' : 'text-gray-400'}`} style={{ borderColor: activeTab === 'grid' ? 'var(--accent-color)' : 'transparent'}}><i className="fas fa-th"></i></button>
                <button onClick={() => setActiveTab('tagged')} className={`flex-1 text-center py-3 text-2xl ${activeTab === 'tagged' ? 'border-b-2 text-black dark:text-white' : 'text-gray-400'}`} style={{ borderColor: activeTab === 'tagged' ? 'var(--accent-color)' : 'transparent'}}><i className="fas fa-tag"></i></button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'grid' && (userPosts.length > 0 ? (<div className="grid grid-cols-3 gap-1">{userPosts.map((post, index) => (<div key={post.id} className="aspect-square bg-gray-200 dark:bg-gray-700 cursor-pointer" onClick={() => handlePostClick(post, index)}>{post.imageUrl && <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />}</div>))}</div>) : (<div className="text-center text-gray-500 p-12"><i className="fas fa-camera-retro text-4xl mb-3"></i><h3 className="font-bold">No Posts Yet</h3><p className="text-sm">Share your work by creating a new post.</p></div>))}
                {activeTab === 'tagged' && (<div className="text-center text-gray-500 p-12"><i className="fas fa-tag text-4xl mb-3"></i><h3 className="font-bold">Photos and videos of you</h3><p className="text-sm">When people tag you in photos and videos, they'll appear here.</p></div>)}
            </div>
            {isEditModalOpen && <EditProfileModal currentUser={currentUser} onUpdateProfile={onUpdateProfile} onClose={() => setIsEditModalOpen(false)} />}
            {selectedPost && selectedPostIndex !== null && (
                <PostDetailModal
                    post={selectedPost}
                    currentUser={currentUser}
                    onClose={() => { setSelectedPost(null); setSelectedPostIndex(null); }}
                    onPostUpdate={(updatedPost) => setSelectedPost(updatedPost)}
                    onPrev={handlePrevPost}
                    onNext={handleNextPost}
                    currentIndex={selectedPostIndex}
                    totalPosts={userPosts.length}
                />
            )}
        </div>
    );
};

export default ProfileView;