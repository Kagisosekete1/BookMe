
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { POSTS, getTalentByPost, addCommentToPost, TALENTS, toggleCommentLike } from '../../data/mockData';
import { Post, User, Comment as CommentType } from '../../types';

// --- Reusable Modals ---

const ImageViewerModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]" onClick={onClose}>
        <div className="relative max-w-full max-h-full p-4">
            <img src={imageUrl} alt="Profile" className="object-contain max-w-full max-h-[90vh] rounded-lg" />
            <button onClick={onClose} className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <i className="fas fa-times"></i>
            </button>
        </div>
    </div>
);

interface ReportModalProps {
    itemType: 'post';
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

interface CommentsModalProps {
    post: Post;
    currentUser: User;
    onClose: () => void;
    onAddComment: (text: string) => void;
    onViewImage: (url: string) => void;
    onLikeComment: (commentId: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ post, currentUser, onClose, onAddComment, onViewImage, onLikeComment }) => {
    const [newComment, setNewComment] = useState('');

    const handlePostComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };
    
    return (
        <div className="absolute inset-0 flex flex-col justify-end z-50">
            <div className="absolute inset-0 bg-black bg-opacity-60 animate-fade-in-backdrop" onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl w-full max-h-[75%] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="text-center py-3 border-b border-gray-200 dark:border-gray-700 relative shrink-0">
                    <h3 className="text-lg font-bold">Comments</h3>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-4 text-2xl w-8 h-8 flex items-center justify-center">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {post.comments.map(comment => {
                        const isTalent = TALENTS.some(t => t.id === comment.userId);
                        return (
                            <div key={comment.id} className="flex items-start space-x-3 group">
                                <button onClick={() => onViewImage(comment.profileImage)} className="shrink-0">
                                    <img src={comment.profileImage} alt={comment.user} className="w-8 h-8 rounded-full" />
                                </button>
                                <div className="flex-grow">
                                    <p>
                                        {isTalent ? (
                                            <Link to={`/talent/${comment.userId}`} onClick={onClose} className="font-bold text-sm hover:underline">{comment.user}</Link>
                                        ) : (
                                            <span className="font-bold text-sm">{comment.user}</span>
                                        )}
                                        {' '}
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</span>
                                    </p>
                                    {comment.likes > 0 && <span className="text-xs text-gray-500 mt-1">{comment.likes} likes</span>}
                                </div>
                                <button onClick={() => onLikeComment(comment.id)} className="shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <i className={`${comment.isLiked ? 'fas text-red-500' : 'far'} fa-heart`}></i>
                                </button>
                            </div>
                        );
                    })}
                </div>
                 <div className="p-2 border-t border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center space-x-2">
                         <img src={currentUser.profileImage} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 px-4 outline-none"
                        />
                        <button 
                            onClick={handlePostComment} 
                            className="font-semibold text-[var(--accent-color)] border border-[var(--accent-color)] rounded-full px-4 py-1 text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors disabled:opacity-50" 
                            disabled={!newComment.trim()}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const PostCard: React.FC<{ post: Post; onOpenComments: (post: Post) => void; onReport: () => void; }> = ({ post, onOpenComments, onReport }) => {
    const talent = getTalentByPost(post);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    
    if (!talent) return null;

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 py-4">
            <div className="flex items-center px-4 mb-3">
                <Link to={`/talent/${talent.id}`} className="flex items-center flex-grow min-w-0">
                    <img src={talent.profileImage} alt={talent.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <p className="font-bold truncate">{talent.name}</p>
                        <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                </Link>
                 <button onClick={onReport} className="text-gray-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
                    <i className="fas fa-ellipsis-h"></i>
                </button>
            </div>
            <p className="px-4 mb-3">{post.text}</p>
            {post.imageUrl && (
                <img src={post.imageUrl} alt="Post content" className="w-full h-auto" />
            )}
            <div className="flex justify-start items-center mt-3 text-gray-500 dark:text-gray-400 px-4 space-x-8">
                <button onClick={() => {
                    setIsLiked(!isLiked);
                    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
                }} className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                    <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
                    <span>{likeCount}</span>
                </button>
                <button onClick={() => onOpenComments(post)} className="flex items-center space-x-2 hover:text-blue-500">
                    <i className="far fa-comment"></i>
                    <span>{post.commentsCount}</span>
                </button>
            </div>
        </div>
    );
};

const AdCard: React.FC = () => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-800 py-4 px-4">
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <i className="fas fa-bullhorn text-gray-500"></i>
                </div>
                <div>
                    <p className="font-bold">Your Next Favorite Brand</p>
                    <p className="text-xs text-gray-500">Sponsored</p>
                </div>
            </div>
            <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400 font-semibold">ADVERTISEMENT</p>
            </div>
            <p className="text-sm mt-2">Discover amazing products and services tailored just for you. Shop now and get exclusive discounts!</p>
            <button className="mt-2 w-full text-sm font-bold border-2 border-[var(--accent-color)] text-[var(--accent-color)] py-2 px-4 rounded-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                Learn More
            </button>
        </div>
    );
};

interface HomeViewProps {
    currentUser: User;
}

const HomeView: React.FC<HomeViewProps> = ({ currentUser }) => {
    const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
    const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);
    const [reportPost, setReportPost] = useState<Post | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // --- Scroll Position Persistence ---
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                sessionStorage.setItem('homeScrollPos', String(scrollRef.current.scrollTop));
            }
        };

        const scrollEl = scrollRef.current;
        scrollEl?.addEventListener('scroll', handleScroll);

        return () => {
            scrollEl?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            const savedPos = sessionStorage.getItem('homeScrollPos');
            if (savedPos) {
                scrollRef.current.scrollTop = Number(savedPos);
            }
        }
    }, []);


    const handleAddComment = (text: string) => {
        if (!activeCommentsPost) return;

        const newComment: CommentType = {
            id: `c${Date.now()}`,
            user: currentUser.name,
            userId: currentUser.id,
            profileImage: currentUser.profileImage,
            text,
            likes: 0,
            isLiked: false,
        };
        
        addCommentToPost(activeCommentsPost.id, newComment);
        setActiveCommentsPost({ ...activeCommentsPost });
    };

    const handleLikeComment = (commentId: string) => {
        if (!activeCommentsPost) return;
        toggleCommentLike(commentId);
        setActiveCommentsPost({ ...activeCommentsPost });
    };

    const handleReportSubmit = () => {
        setReportPost(null);
        alert('Thank you. Your report has been submitted.');
    };

    return (
        <div className="h-full relative">
            <div ref={scrollRef} className="h-full overflow-y-auto">
                {/* Posts Feed */}
                {POSTS.flatMap((post, index) => {
                    const content = [<PostCard key={post.id} post={post} onOpenComments={setActiveCommentsPost} onReport={() => setReportPost(post)} />];
                    // Show an ad after every 4th post for free users
                    if (!currentUser.isPremium && (index + 1) % 4 === 0) {
                        content.push(<AdCard key={`ad-${index}`} />);
                    }
                    return content;
                })}
            </div>

            {activeCommentsPost && (
                <CommentsModal 
                    post={activeCommentsPost} 
                    currentUser={currentUser}
                    onClose={() => setActiveCommentsPost(null)}
                    onAddComment={handleAddComment}
                    onViewImage={setViewerImageUrl}
                    onLikeComment={handleLikeComment}
                />
            )}
            
            {reportPost && (
                <ReportModal itemType="post" onClose={() => setReportPost(null)} onSubmit={handleReportSubmit} />
            )}

            {viewerImageUrl && (
                <ImageViewerModal imageUrl={viewerImageUrl} onClose={() => setViewerImageUrl(null)} />
            )}
        </div>
    );
};

export default HomeView;
