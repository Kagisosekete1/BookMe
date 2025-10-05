import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TALENTS, JOBS, getClientById } from '../../data/mockData';
import { Talent, Job, User, UserRole } from '../../types';

const getVerificationIcon = (userOrTalent: { verificationTier?: 'gold' | 'blue', isPremium?: boolean }) => {
    if (userOrTalent.isPremium) {
        return <i className={`fas fa-gem text-yellow-500 ml-1.5 text-sm`} title="Premium Subscriber"></i>;
    }
    if (userOrTalent.verificationTier) {
        const color = userOrTalent.verificationTier === 'gold' ? 'text-yellow-400' : 'text-blue-500';
        return <i className={`fas fa-check-circle ${color} ml-1.5 text-sm`} title="Verified"></i>;
    }
    return null;
};

const AdBanner: React.FC = () => (
    <div className="p-2">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center">
            <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-md mr-3">
                <i className="fas fa-bullhorn text-gray-500"></i>
            </div>
            <div className="flex-grow">
                <p className="text-xs font-bold">Upgrade to Premium</p>
                <p className="text-xs text-gray-500">Enjoy an ad-free experience.</p>
            </div>
            <Link to="/settings/subscription" className="text-xs font-bold text-white bg-[var(--accent-color)] py-1 px-3 rounded-md hover:opacity-90">
                Go Pro
            </Link>
        </div>
    </div>
);


const TalentCard: React.FC<{ talent: Talent }> = ({ talent }) => {
    // In a real app, you would fetch the full user object to check `isPremium`.
    // Here, we'll just use the talent object's properties for the verification icon.
    return (
        <Link to={`/talent/${talent.id}`} className="block bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
                <img src={talent.profileImage} alt={talent.name} className="w-16 h-16 rounded-full mr-4" />
                <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center">{talent.name} {getVerificationIcon(talent)}</h3>
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
                <span className="flex items-center">{client.name} {getVerificationIcon(client)}</span>
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

    // --- Client-specific state ---
    const [radius, setRadius] = useState(30); // Default radius in km for client search

    // --- Talent-specific state ---
    const [locationQuery, setLocationQuery] = useState('');

    // --- Client-specific filtering ---
    const filteredTalent = useMemo(() => {
        if (!isClient) return [];
        let results = TALENTS;

        // Filter by text query
        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            results = results.filter(talent => 
                talent.name.toLowerCase().includes(lowerCaseQuery) ||
                talent.hustles.some(hustle => hustle.toLowerCase().includes(lowerCaseQuery))
            );
        }

        // Filter by distance/radius
        results = results.filter(talent => talent.distance <= radius);
        
        return results;
    }, [query, radius, isClient]);
    
    // --- Talent-specific filtering ---
    const relevantJobs = useMemo(() => {
        if (isClient || !currentUser.profession) return [];
        return JOBS.filter(job => currentUser.profession?.includes(job.requiredProfession));
    }, [isClient, currentUser.profession]);

    const filteredJobs = useMemo(() => {
        if (isClient) return [];
        let results = relevantJobs;

        // Filter by text query
        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            results = results.filter(job => 
                job.title.toLowerCase().includes(lowerCaseQuery) ||
                job.description.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // Filter by location query
        if (locationQuery) {
            const lowerCaseLocationQuery = locationQuery.toLowerCase();
            results = results.filter(job =>
                job.location.toLowerCase().includes(lowerCaseLocationQuery)
            );
        }
        
        return results;
    }, [query, locationQuery, isClient, relevantJobs]);

    const handleUseMyLocation = () => {
        // Simulate getting user's location and setting it.
        // In a real app, this would use navigator.geolocation and a reverse geocoder.
        setLocationQuery('Johannesburg, GP');
    };

    return (
        <div className="h-full flex flex-col">
            {isClient ? (
                <>
                    {/* Client: Main Search Bar */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for any service..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3 pl-10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    {/* Client: Radius Slider */}
                    <div className="px-4 pt-4 shrink-0">
                        <label htmlFor="radius-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Distance
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                id="radius-slider"
                                type="range"
                                min="1"
                                max="100"
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <span className="font-semibold text-sm w-20 text-right">{`≤ ${radius} km`}</span>
                        </div>
                    </div>
                    
                    {/* Client: Results */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 pt-4">
                        {filteredTalent.length > 0 ? (
                            filteredTalent.map(talent => <TalentCard key={talent.id} talent={talent} />)
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No talent found matching your criteria.</p>
                            </div>
                        )}
                         {!currentUser.isPremium && <AdBanner />}
                    </div>
                </>
            ) : (
                <>
                    {/* Talent: Search Bars */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
                        <div className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Search for jobs..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3 pl-10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Location (e.g., Sandton, JHB)"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3 pl-10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                            />
                            <i className="fas fa-map-marker-alt absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <button onClick={handleUseMyLocation} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white" title="Use my location">
                                <i className="fas fa-crosshairs"></i>
                            </button>
                        </div>
                    </div>

                    {/* Talent: Results */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                        <h2 className="text-xl font-bold text-black dark:text-white">Job Board</h2>
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No relevant jobs found matching your criteria.</p>
                                <p className="text-xs text-gray-400 mt-1">Try broadening your search or check back later.</p>
                            </div>
                        )}
                        {!currentUser.isPremium && <AdBanner />}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchView;