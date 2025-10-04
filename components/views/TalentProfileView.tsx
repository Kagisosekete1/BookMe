

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTalentById, findOrCreateConversationByTalentId } from '../../data/mockData';

const getVerificationIcon = (tier?: 'gold' | 'blue') => {
    if (!tier) return null;
    const color = tier === 'gold' ? 'text-yellow-500' : 'text-blue-500';
    return <i className={`fas fa-star ${color} ml-2 text-base`}></i>;
};

const TalentProfileView: React.FC = () => {
    const { talentId } = useParams<{ talentId: string }>();
    const talent = getTalentById(talentId);
    const navigate = useNavigate();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    const handleMessage = () => {
        if (!talent) return;
        const conversation = findOrCreateConversationByTalentId(talent.id);
        navigate(`/messages/${conversation.id}`);
    };

    if (!talent) {
        return <div className="p-6 text-center">Talent not found.</div>;
    }

    const BookingModal = () => {
        const [date, setDate] = useState('');
        const [eventType, setEventType] = useState('');
        const [notes, setNotes] = useState('');

        const handleSubmitBooking = () => {
            if(!date || !eventType) {
                alert('Please select a date and event type.');
                return;
            }
            // In a real app, this would submit to a backend.
            console.log({
                talentId: talent.id,
                date,
                eventType,
                notes
            });
            alert(`Booking request sent to ${talent.name} for ${date}!`);
            setIsBookingModalOpen(false);
        };

        return (
             <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm m-4">
                    <h3 className="text-lg font-bold mb-4 text-center">Book {talent.name}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
                             <select
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            >
                                <option value="">Select event type...</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Corporate Event">Corporate Event</option>
                                <option value="Private Party">Private Party</option>
                                <option value="Photoshoot">Photoshoot</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
                            <textarea
                                rows={3}
                                value={notes}
                                placeholder="Any specific requirements?"
                                onChange={(e) => setNotes(e.target.value)}
                                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button onClick={() => setIsBookingModalOpen(false)} className="border border-gray-300 dark:border-gray-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button onClick={handleSubmitBooking} className="border border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-2 px-4 rounded-lg text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">Send Request</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto relative">
            {/* Header */}
            <div className="p-6 flex flex-col items-center text-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <img src={talent.profileImage} alt={talent.name} className="w-24 h-24 rounded-full mb-4 ring-4 ring-gray-200 dark:ring-gray-700" />
                <h2 className="text-2xl font-bold flex items-center">{talent.name} {getVerificationIcon(talent.verificationTier)}</h2>
                <div className="flex items-center text-md mt-1 text-gray-500">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-semibold mr-2">{talent.rating.toFixed(1)}</span>
                    <span>({talent.reviewsCount} reviews)</span>
                </div>
                <p className="text-sm mt-3 max-w-md text-gray-600 dark:text-gray-400">{talent.bio}</p>
                 <div className="mt-4 w-full max-w-sm space-y-2">
                    <button onClick={() => setIsBookingModalOpen(true)} className="w-full border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white font-bold py-3 px-4 rounded-lg text-md hover:opacity-90 transition-colors">Book Now</button>
                    <div className="flex space-x-2">
                        <button onClick={handleMessage} className="w-1/2 border-2 border-gray-300 dark:border-gray-600 font-bold py-3 px-4 rounded-lg text-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Message</button>
                        <button
                            onClick={() => setFriendRequestSent(true)}
                            disabled={friendRequestSent}
                            className="w-1/2 border-2 border-gray-300 dark:border-gray-600 font-bold py-3 px-4 rounded-lg text-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {friendRequestSent ? 'Request Sent' : 'Add Friend'}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Hustles */}
            <div className="p-4">
                 <h3 className="text-lg font-bold mb-3 px-2">Services</h3>
                 <div className="flex flex-wrap gap-2">
                     {talent.hustles.map(hustle => (
                        <span key={hustle} className="bg-gray-100 dark:bg-gray-800 text-sm font-medium px-3 py-1 rounded-full">{hustle}</span>
                     ))}
                 </div>
            </div>
            
            {/* Portfolio */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                 <h3 className="text-lg font-bold mb-3 px-2">Portfolio</h3>
                 <div className="grid grid-cols-3 gap-1">
                     {talent.portfolio.map((item, index) => (
                         <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded">
                             <img src={item.url} alt={`Portfolio item ${index+1}`} className="w-full h-full object-cover rounded"/>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Reviews */}
             <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                 <h3 className="text-lg font-bold mb-3 px-2">Recent Jobs & Reviews</h3>
                 <div className="space-y-4">
                     {talent.reviews.map((review, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <div className="flex items-center mb-1">
                                 <p className="font-bold text-sm mr-2">{review.reviewer}</p>
                                 <div className="flex text-yellow-500">
                                     {[...Array(review.rating)].map((_, i) => <i key={i} className="fas fa-star text-xs"></i>)}
                                 </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                        </div>
                     ))}
                 </div>
            </div>
            {isBookingModalOpen && <BookingModal />}
        </div>
    );
};

export default TalentProfileView;