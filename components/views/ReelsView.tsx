import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { REELS, getTalentByReel, addCommentToReel, TALENTS, toggleCommentLike } from '../../data/mockData';
import { Reel, User, Comment as CommentType } from '../../types';

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

interface CommentsModalProps {
    reel: Reel;
    currentUser: User;
    onClose: () => void;
    onAddComment: (text: string) => void;
    onViewImage: (url: string) => void;
    onLikeComment: (commentId: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ reel, currentUser, onClose, onAddComment, onViewImage, onLikeComment }) => {
    const [newComment, setNewComment] = useState('');

    const handlePostComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };
    
    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-start pt-28 z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-b-2xl shadow-xl w-full max-h-[75%] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="text-center py-3 border-b border-gray-200 dark:border-gray-700 relative">
                    <h3 className="text-lg font-bold">Comments</h3>
                    <button onClick={onClose} className="absolute top-2 right-4 text-2xl">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {reel.comments.map(comment => {
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

const ReelCard: React.FC<{ reel: Reel; isVisible: boolean; onOpenComments: (reel: Reel) => void; }> = ({ reel, isVisible, onOpenComments }) => {
    const talent = getTalentByReel(reel);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(reel.likes);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <div className="h-full w-full relative snap-start flex-shrink-0">
            {/* In a real app, this would be a <video> element */}
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                 <img src={`https://picsum.photos/seed/${reel.id}/400/800`} className="absolute inset-0 w-full h-full object-cover" alt="Reel background"/>
                 <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                 <i className={`fas fa-play text-white text-6xl transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></i>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black via-black/50 to-transparent">
                <Link to={`/talent/${talent?.id}`} className="flex items-center mb-2">
                    <img src={talent?.profileImage} alt={talent?.name} className="w-10 h-10 rounded-full border-2 border-white mr-3" />
                    <p className="font-bold">{talent?.name}</p>
                </Link>
                <p className="text-sm mb-2">{reel.caption}</p>
                <div className="flex items-center text-xs">
                    <i className="fas fa-music mr-2"></i>
                    <span>{reel.music.title} - {reel.music.artist}</span>
                </div>
            </div>

            <div className="absolute bottom-16 right-2 flex flex-col items-center space-y-4 text-white">
                <button onClick={handleLike} className="flex flex-col items-center">
                    <i className={`fas fa-heart text-3xl transition-colors ${isLiked ? 'text-red-500' : ''}`}></i>
                    <span className="text-sm font-semibold">{likeCount}</span>
                </button>
                <button onClick={() => onOpenComments(reel)} className="flex flex-col items-center">
                    <i className="fas fa-comment-dots text-3xl"></i>
                    <span className="text-sm font-semibold">{reel.commentsCount}</span>
                </button>
            </div>
        </div>
    );
};

interface ReelsViewProps {
    currentUser: User;
}

const ReelsView: React.FC<ReelsViewProps> = ({ currentUser }) => {
    const [activeCommentsReel, setActiveCommentsReel] = useState<Reel | null>(null);
    const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

    const handleAddComment = (text: string) => {
        if (!activeCommentsReel) return;

        const newComment: CommentType = {
            id: `cr${Date.now()}`,
            user: currentUser.name,
            userId: currentUser.id,
            profileImage: currentUser.profileImage,
            text,
            likes: 0,
            isLiked: false,
        };

        addCommentToReel(activeCommentsReel.id, newComment);
        setActiveCommentsReel({ ...activeCommentsReel });
    };

    const handleLikeComment = (commentId: string) => {
        if (!activeCommentsReel) return;
        toggleCommentLike(commentId);
        setActiveCommentsReel({ ...activeCommentsReel });
    };

    // Basic implementation without intersection observer for simplicity
    return (
        <div className="h-full w-full relative">
            <div className="h-full w-full overflow-y-auto snap-y snap-mandatory">
                {REELS.map((reel) => (
                    <ReelCard key={reel.id} reel={reel} isVisible={true} onOpenComments={setActiveCommentsReel} />
                ))}
            </div>
            {activeCommentsReel && (
                <CommentsModal 
                    reel={activeCommentsReel}
                    currentUser={currentUser}
                    onClose={() => setActiveCommentsReel(null)}
                    onAddComment={handleAddComment}
                    onViewImage={setViewerImageUrl}
                    onLikeComment={handleLikeComment}
                />
            )}
             {viewerImageUrl && (
                <ImageViewerModal imageUrl={viewerImageUrl} onClose={() => setViewerImageUrl(null)} />
            )}
        </div>
    );
};

export default ReelsView;