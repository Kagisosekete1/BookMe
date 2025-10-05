import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTalentById, findOrCreateConversationByTalentId, getPostsByTalentId, getTalentByPost, addCommentToPost, TALENTS, USERS } from '../../data/mockData';
import { Post, User, Comment as CommentType } from '../../types';

// --- Reusable Helper Components (defined here to avoid creating new files) ---

const getVerificationIcon = (userOrTalent: { verificationTier?: 'gold' | 'blue', isPremium?: boolean }) => {
    if (userOrTalent.isPremium) {
        return <i className={`fas fa-gem text-yellow-500 ml-2 text-base`} title="Premium Subscriber"></i>;
    }
    if (userOrTalent.verificationTier) {
        const color = userOrTalent.verificationTier === 'gold' ? 'text-yellow-400' : 'text-blue-500';
        return <i className={`fas fa-check-circle ${color} ml-2 text-base`} title="Verified"></i>;
    }
    return null;
};

const ImageViewerModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]" onClick={onClose}>
        <div className="relative max-w-full max-h-full p-4">
            <img src={imageUrl} alt="Profile" className="object-contain max-w-full max-h-[90vh] rounded-lg" />
        </div>
    </div>
);

interface ReportModalProps {
    itemType: 'profile' | 'post';
    onClose: () => void;
    onSubmit: () => void;
}
const ReportModal: React.FC<ReportModalProps> = ({ itemType, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const reasons = ['Spam', 'Inappropriate Content', 'Impersonation', 'Scam or Fraud', 'Other'];
    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4 text-center">Report {itemType}</h3>
                <div className="space-y-2 mb-4">{reasons.map(r => (<label key={r} className="flex items-center"><input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-gray-300" /><span className="ml-3 text-sm">{r}</span></label>))}</div>
                <textarea rows={3} placeholder="Additional details (optional)..." className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none" />
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="border border-gray-300 dark:border-gray-600 font-bold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button onClick={onSubmit} disabled={!reason} className="border bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-sm disabled:opacity-50">Submit Report</button>
                </div>
            </div>
        </div>
    );
};

interface PostDetailModalProps {
    post: Post;
    currentUser: User;
    onClose: () => void;
    onPostUpdate: (updatedPost: Post) => void;
    onReport: () => void;
}
const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, currentUser, onClose, onPostUpdate, onReport }) => {
    const talent = getTalentByPost(post);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment: CommentType = { id: `c${Date.now()}`, user: currentUser.name, userId: currentUser.id, profileImage: currentUser.profileImage, text: newComment.trim() };
        addCommentToPost(post.id, comment);
        onPostUpdate({ ...post });
        setNewComment('');
    };

    if (!talent) return null;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col m-4 relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
                    <img src={talent.profileImage} alt={talent.name} className="w-10 h-10 rounded-full mr-3" />
                    <p className="font-bold flex-grow">{talent.name}</p>
                    <button onClick={onReport} className="text-gray-500 dark:text-gray-400 w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><i className="fas fa-ellipsis-h"></i></button>
                    <button onClick={onClose} className="text-2xl ml-2">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="w-full h-auto" />}
                    <div className="p-4"><p className="mb-4 text-sm">{post.text}</p><div className="flex justify-start items-center text-gray-500 dark:text-gray-400 border-t border-b border-gray-200 dark:border-gray-700 py-2 space-x-8"><button onClick={() => { setIsLiked(!isLiked); setLikeCount(p => isLiked ? p - 1 : p + 1); }} className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}><i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i><span>{likeCount}</span></button><div className="flex items-center space-x-2"><i className="far fa-comment"></i><span>{post.comments.length}</span></div></div></div>
                    <div className="px-4 pb-4 space-y-4">{post.comments.map(c => <div key={c.id} className="flex items-start space-x-3"><img src={c.profileImage} alt={c.user} className="w-8 h-8 rounded-full" /><div><p><span className="font-bold text-sm">{c.user}</span>{' '}<span className="text-sm text-gray-700 dark:text-gray-300">{c.text}</span></p></div></div>)}</div>
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center space-x-2"><img src={currentUser.profileImage} alt={currentUser.name} className="w-10 h-10 rounded-full" /><input type="text" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddComment()} className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 px-4 outline-none" /><button onClick={handleAddComment} className="font-semibold text-[var(--accent-color)] hover:opacity-80 disabled:opacity-50" disabled={!newComment.trim()}>Post</button></div>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

const TalentProfileView: React.FC = () => {
    const { talentId } = useParams<{ talentId: string }>();
    const talent = getTalentById(talentId);
    const user = USERS.find(u => u.talentId === talentId);
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState<'posts' | 'portfolio' | 'reviews'>('posts');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState<{ type: 'profile' | 'post' | null }>({ type: null });
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    const talentPosts = getPostsByTalentId(talentId);
    // A mock current user for post interactions. In a real app, this would come from context.
    const mockCurrentUser = { id: 'client-test', name: 'Test Client', profileImage: 'https://picsum.photos/seed/client/200' } as User;

    const handleMessage = () => {
        if (!talent) return;
        const conversation = findOrCreateConversationByTalentId(talent.id);
        navigate(`/messages/${conversation.id}`);
    };
    
    const handleReportSubmit = () => {
        setIsReportModalOpen({ type: null });
        alert('Thank you. Your report has been submitted.');
    };

    if (!talent) {
        return <div className="p-6 text-center">Talent not found.</div>;
    }

    const Header: React.FC<{ title: string; onBack: () => void; onOpenMenu: () => void; }> = ({ title, onBack, onOpenMenu }) => (
        <div className="flex items-center p-3 pt-12 border-b border-gray-200 dark:border-gray-800 shrink-0 h-28 bg-white dark:bg-black sticky top-0 z-10">
            <button onClick={onBack} className="text-xl w-10 text-center shrink-0"><i className="fas fa-arrow-left"></i></button>
            <h2 className="font-bold text-lg flex items-center justify-center flex-grow truncate"><span className="truncate">{title}</span></h2>
            <button onClick={onOpenMenu} className="text-lg w-10 text-center shrink-0"><i className="fas fa-ellipsis-h"></i></button>
        </div>
    );

    const BookingModal = () => (
         <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4">
                <h3 className="text-lg font-bold mb-4 text-center">Book {talent.name}</h3>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium">Date</label><input type="date" className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg p-2"/></div>
                    <div><label className="block text-sm font-medium">Event Type</label><select className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg p-2"><option>Select...</option><option>Wedding</option><option>Corporate</option></select></div>
                </div>
                <div className="mt-6 flex justify-end space-x-2"><button onClick={() => setIsBookingModalOpen(false)} className="border border-gray-300 font-bold py-2 px-4 rounded-lg text-sm">Cancel</button><button onClick={() => { alert(`Booking request sent!`); setIsBookingModalOpen(false); }} className="border border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-2 px-4 rounded-lg text-sm">Send Request</button></div>
            </div>
        </div>
    );
    
    const ActionMenu = () => (
        <div className="absolute inset-0 z-20" onClick={() => setIsActionMenuOpen(false)}>
            <div className="absolute top-24 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-48 border border-gray-100 dark:border-gray-700">
                <button onClick={() => { setIsReportModalOpen({ type: 'profile' }); setIsActionMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"><i className="fas fa-flag w-6"></i>Report Profile</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"><i className="fas fa-user-plus w-6"></i>Add Friend</button>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-black relative">
            <Header title={talent.name} onBack={() => navigate(-1)} onOpenMenu={() => setIsActionMenuOpen(true)} />
            <div className="flex-grow overflow-y-auto">
                <div className="p-6 flex flex-col items-center text-center bg-white dark:bg-black">
                    <button onClick={() => setIsImageViewerOpen(true)}><img src={talent.profileImage} alt={talent.name} className="w-24 h-24 rounded-full mb-4 ring-4 ring-gray-200 dark:ring-gray-700" /></button>
                    <h2 className="text-2xl font-bold flex items-center">{talent.name} {getVerificationIcon({ ...talent, isPremium: user?.isPremium })}</h2>
                    <div className="flex items-center text-md mt-1 text-gray-500"><span className="text-yellow-500 mr-1">⭐</span><span className="font-semibold mr-2">{talent.rating.toFixed(1)}</span><span>({talent.reviewsCount} reviews)</span></div>
                    <p className="text-sm mt-3 max-w-md text-gray-600 dark:text-gray-400">{talent.bio}</p>
                    <div className="mt-4 w-full max-w-sm space-y-2"><button onClick={() => setIsBookingModalOpen(true)} className="w-full border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white font-bold py-3 px-4 rounded-lg text-md">Book Now</button><div className="flex space-x-2"><button onClick={handleMessage} className="w-full border-2 border-gray-300 dark:border-gray-600 font-bold py-3 px-4 rounded-lg text-md">Message</button></div></div>
                </div>
                
                <div className="flex border-y border-gray-200 dark:border-gray-800 shrink-0 sticky top-[7rem] bg-white dark:bg-black z-10">
                    <button onClick={() => setActiveTab('posts')} className={`flex-1 text-center py-3 text-2xl ${activeTab === 'posts' ? 'border-b-2 text-black dark:text-white' : 'text-gray-400'}`} style={{ borderColor: activeTab === 'posts' ? 'var(--accent-color)' : 'transparent' }}><i className="fas fa-th"></i></button>
                    <button onClick={() => setActiveTab('portfolio')} className={`flex-1 text-center py-3 text-2xl ${activeTab === 'portfolio' ? 'border-b-2 text-black dark:text-white' : 'text-gray-400'}`} style={{ borderColor: activeTab === 'portfolio' ? 'var(--accent-color)' : 'transparent' }}><i className="fas fa-camera-retro"></i></button>
                    <button onClick={() => setActiveTab('reviews')} className={`flex-1 text-center py-3 text-2xl ${activeTab === 'reviews' ? 'border-b-2 text-black dark:text-white' : 'text-gray-400'}`} style={{ borderColor: activeTab === 'reviews' ? 'var(--accent-color)' : 'transparent' }}><i className="fas fa-star"></i></button>
                </div>

                <div className="p-1">
                    {activeTab === 'posts' && (talentPosts.length > 0 ? (<div className="grid grid-cols-3 gap-1">{talentPosts.map(post => (<div key={post.id} className="aspect-square bg-gray-200 dark:bg-gray-700 cursor-pointer" onClick={() => setSelectedPost(post)}>{post.imageUrl && <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />}</div>))}</div>) : (<div className="text-center text-gray-500 p-12"><i className="fas fa-camera-retro text-4xl mb-3"></i><h3 className="font-bold">No Posts Yet</h3></div>))}
                    {activeTab === 'portfolio' && (talent.portfolio.length > 0 ? (<div className="grid grid-cols-3 gap-1">{talent.portfolio.map((item, index) => (<div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded"><img src={item.url} alt={`Portfolio item ${index+1}`} className="w-full h-full object-cover rounded"/></div>))}</div>) : (<div className="text-center text-gray-500 p-12"><i className="fas fa-image text-4xl mb-3"></i><h3 className="font-bold">No Portfolio Items</h3></div>))}
                    {activeTab === 'reviews' && (talent.reviews.length > 0 ? (<div className="space-y-4 p-3">{talent.reviews.map((review, index) => (<div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg"><div className="flex items-center mb-1"><p className="font-bold text-sm mr-2">{review.reviewer}</p><div className="flex text-yellow-500">{[...Array(review.rating)].map((_, i) => <i key={i} className="fas fa-star text-xs"></i>)}</div></div><p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p></div>))}</div>) : (<div className="text-center text-gray-500 p-12"><i className="fas fa-comment-slash text-4xl mb-3"></i><h3 className="font-bold">No Reviews Yet</h3></div>))}
                </div>
                
            </div>
            {isBookingModalOpen && <BookingModal />}
            {isActionMenuOpen && <ActionMenu />}
            {isImageViewerOpen && <ImageViewerModal imageUrl={talent.profileImage} onClose={() => setIsImageViewerOpen(false)} />}
            {isReportModalOpen.type && <ReportModal itemType={isReportModalOpen.type} onClose={() => setIsReportModalOpen({ type: null })} onSubmit={handleReportSubmit} />}
            {selectedPost && <PostDetailModal post={selectedPost} currentUser={mockCurrentUser} onClose={() => setSelectedPost(null)} onPostUpdate={(p) => setSelectedPost(p)} onReport={() => setIsReportModalOpen({ type: 'post' })} />}
        </div>
    );
};

export default TalentProfileView;