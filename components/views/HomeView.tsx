import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { POSTS, getTalentByPost, addCommentToPost, TALENTS } from '../../data/mockData';
import { Post, User, Comment as CommentType, Reel } from '../../types';

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
    post: Post | Reel;
    currentUser: User;
    onClose: () => void;
    onAddComment: (text: string) => void;
    onViewImage: (url: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ post, currentUser, onClose, onAddComment, onViewImage }) => {
    const [newComment, setNewComment] = useState('');

    const handlePostComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };
    
    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-end z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl w-full max-h-[75%] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="text-center py-3 border-b border-gray-200 dark:border-gray-700 relative">
                    <h3 className="text-lg font-bold">Comments</h3>
                    <button onClick={onClose} className="absolute top-2 right-4 text-2xl">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {post.comments.map(comment => {
                        const isTalent = TALENTS.some(t => t.id === comment.userId);
                        return (
                            <div key={comment.id} className="flex items-start space-x-3">
                                <button onClick={() => onViewImage(comment.profileImage)} className="shrink-0">
                                    <img src={comment.profileImage} alt={comment.user} className="w-8 h-8 rounded-full" />
                                </button>
                                <div>
                                    <p>
                                        {isTalent ? (
                                            <Link to={`/talent/${comment.userId}`} onClick={onClose} className="font-bold text-sm hover:underline">{comment.user}</Link>
                                        ) : (
                                            <span className="font-bold text-sm">{comment.user}</span>
                                        )}
                                        {' '}
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</span>
                                    </p>
                                </div>
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


const PostCard: React.FC<{ post: Post; onOpenComments: (post: Post) => void }> = ({ post, onOpenComments }) => {
    const talent = getTalentByPost(post);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    
    if (!talent) return null;

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 py-4">
            <Link to={`/talent/${talent.id}`} className="flex items-center px-4 mb-3">
                <img src={talent.profileImage} alt={talent.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <p className="font-bold">{talent.name}</p>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
            </Link>
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

interface HomeViewProps {
    currentUser: User;
}

const HomeView: React.FC<HomeViewProps> = ({ currentUser }) => {
    const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
    const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

    const handleAddComment = (text: string) => {
        if (!activeCommentsPost) return;

        const newComment: CommentType = {
            id: `c${Date.now()}`,
            user: currentUser.name,
            userId: currentUser.id,
            profileImage: currentUser.profileImage,
            text,
        };
        
        // This mutates the global POSTS array and the object within it
        addCommentToPost(activeCommentsPost.id, newComment);

        // Create a new object reference to trigger react's state update,
        // ensuring the modal re-renders with the latest comment.
        setActiveCommentsPost({ ...activeCommentsPost });
    };


    return (
        <div className="h-full overflow-y-auto relative">
            {/* Posts Feed */}
            {POSTS.map(post => <PostCard key={post.id} post={post} onOpenComments={setActiveCommentsPost}/>)}

            {activeCommentsPost && (
                <CommentsModal 
                    post={activeCommentsPost} 
                    currentUser={currentUser}
                    onClose={() => setActiveCommentsPost(null)}
                    onAddComment={handleAddComment}
                    onViewImage={setViewerImageUrl}
                />
            )}

            {viewerImageUrl && (
                <ImageViewerModal imageUrl={viewerImageUrl} onClose={() => setViewerImageUrl(null)} />
            )}
        </div>
    );
};

export default HomeView;