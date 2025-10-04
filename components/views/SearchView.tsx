


import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TALENTS, JOBS, getClientById } from '../../data/mockData';
import { Talent, Job, User, UserRole } from '../../types';

const getVerificationIcon = (tier?: 'gold' | 'blue') => {
    if (!tier) return null;
    const color = tier === 'gold' ? 'text-yellow-500' : 'text-blue-500';
    return <i className={`fas fa-star ${color} ml-1.5 text-sm`}></i>;
};


const TalentCard: React.FC<{ talent: Talent }> = ({ talent }) => {
    return (
        <Link to={`/talent/${talent.id}`} className="block bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
                <img src={talent.profileImage} alt={talent.name} className="w-16 h-16 rounded-full mr-4" />
                <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center">{talent.name} {getVerificationIcon(talent.verificationTier)}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{talent.hustles[0]}</p>
                    <div className="flex items-center text-sm mt-2">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="font-semibold mr-2">{talent.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({talent.reviewsCount} reviews)</span>
                        <span className="mx-2">·</span>
                        <span className="text-gray-500">{talent.distance}km away</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
    const client = getClientById(job.clientId);
    if (!client) return null;

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">{job.title}</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">
                <span className="flex items-center">{client.name} {getVerificationIcon(client.verificationTier)}</span>
                <span className="mx-2">·</span>
                <span>{job.location}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{job.description}</p>
            <div className="flex justify-between items-center">
                 <span className="text-md font-bold text-green-600 dark:text-green-400">R {job.budget.toLocaleString()}</span>
                 <button className="border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-2 px-4 rounded-lg text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                    Apply Now
                </button>
            </div>
        </div>
    );
};


interface SearchViewProps {
    currentUser: User;
}

const SearchView: React.FC<SearchViewProps> = ({ currentUser }) => {
    const [query, setQuery] = useState('');
    
    const isClient = currentUser.role === UserRole.Client;

    // --- Client-specific logic ---
    const filteredTalent = useMemo(() => {
        if (!isClient) return [];
        if (!query) return TALENTS;
        const lowerCaseQuery = query.toLowerCase();
        return TALENTS.filter(talent => 
            talent.name.toLowerCase().includes(lowerCaseQuery) ||
            talent.hustles.some(hustle => hustle.toLowerCase().includes(lowerCaseQuery))
        );
    }, [query, isClient]);
    
    // --- Talent-specific logic ---
    const relevantJobs = useMemo(() => {
        if (isClient || !currentUser.profession) return [];
        // Match jobs where the required profession is part of the user's main profession string
        // E.g. User profession "DJ & Event Music" includes job requirement "DJ"
        return JOBS.filter(job => currentUser.profession?.includes(job.requiredProfession));
    }, [isClient, currentUser.profession]);

    const filteredJobs = useMemo(() => {
        if (isClient) return [];
        if (!query) return relevantJobs;
        const lowerCaseQuery = query.toLowerCase();
        return relevantJobs.filter(job => 
            job.title.toLowerCase().includes(lowerCaseQuery) ||
            job.description.toLowerCase().includes(lowerCaseQuery)
        );
    }, [query, isClient, relevantJobs]);

    const renderClientView = () => (
        <>
            {filteredTalent.length > 0 ? (
                filteredTalent.map(talent => <TalentCard key={talent.id} talent={talent} />)
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No talent found for "{query}"</p>
                </div>
            )}
        </>
    );

    const renderTalentView = () => (
        <>
            <h2 className="text-xl font-bold mb-4 px-4 text-black dark:text-white">Job Board</h2>
            {filteredJobs.length > 0 ? (
                filteredJobs.map(job => <JobCard key={job.id} job={job} />)
            ) : (
                 <div className="text-center py-10">
                    <p className="text-gray-500">No relevant jobs found for "{query}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try broadening your search or check back later.</p>
                </div>
            )}
        </>
    );

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={isClient ? "Search for any service..." : "Search for jobs..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3 pl-10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    />
                     <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
               {isClient ? renderClientView() : renderTalentView()}
            </div>
        </div>
    );
};

export default SearchView;