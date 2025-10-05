
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types';
import { addPost, addJob, JOBS } from '../../data/mockData';
import { GoogleGenAI } from "@google/genai";

interface CreateViewProps {
    currentUser: User;
}

const MUSIC_TRACKS = [
    'None', 'Party - Upbeat Mix', 'Wedding - Romantic Ballad', 'Corporate - Focus Flow',
    'Amapiano - Asibe Happy', 'Chill - Lo-fi Beats', 'Rock - Epic Riff',
    'Pop - Catchy Chorus', 'Classical - Serene Strings',
];

const PROFESSIONS = [...new Set(JOBS.map(job => job.requiredProfession))].sort();

const CreateView: React.FC<CreateViewProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    const isTalent = currentUser.role === UserRole.Talent;

    // Common State
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    // Talent State
    const [gigText, setGigText] = useState('');
    const [gigImage, setGigImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [selectedMusic, setSelectedMusic] = useState('');
    const [musicQuery, setMusicQuery] = useState('');
    
    // Client State
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [jobBudget, setJobBudget] = useState<number | ''>('');
    const [jobProfession, setJobProfession] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setIsUploading(true);
            setTimeout(() => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setGigImage(reader.result as string);
                    setIsUploading(false);
                };
                reader.readAsDataURL(file);
            }, 1500);
        }
    };

    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        setAiError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            let prompt: string;
            
            if (isTalent) {
                prompt = `You are a marketing expert for freelancers on a platform called 'Book Me'. Your task is to write a compelling and professional gig post based on the user's simple description. Make it engaging, clear, and attractive to potential clients. Use emojis where appropriate to make it visually appealing. Keep it concise, around 2-3 short paragraphs.\n\nUser's description: "${aiPrompt}"`;
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
                setGigText(response.text);
            } else {
                prompt = `You are an expert recruiter writing a job post for a platform called 'Book Me'. Your task is to write a clear and concise job description based on the user's simple description. Make it engaging and professional to attract the best talent.\n\nUser's description: "${aiPrompt}"`;
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
                setJobDescription(response.text);

                if (!jobTitle) {
                    const titlePrompt = `Based on the following job request, suggest a short, clear job title (max 10 words). Only return the title text itself without quotation marks:\n\n"${aiPrompt}"`;
                    const titleResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: titlePrompt });
                    setJobTitle(titleResponse.text.replace(/"/g, '').trim());
                }
            }
        } catch (error) {
            console.error("Error generating content with AI:", error);
            setAiError("Sorry, something went wrong. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePost = () => {
        setFormError(null);
        if (isTalent) {
            if (!gigText.trim()) {
                setFormError("Post description cannot be empty.");
                return;
            }
            if (currentUser.talentId) {
                addPost({
                    text: gigText, talentId: currentUser.talentId,
                    imageUrl: gigImage || undefined,
                    music: selectedMusic === 'None' || !selectedMusic ? undefined : selectedMusic,
                });
                navigate('/profile');
            } else {
                setFormError("Could not find your Talent ID. Please log out and back in.");
            }
        } else {
            if (!jobTitle.trim() || !jobDescription.trim() || !jobLocation.trim() || !jobBudget || !jobProfession) {
                setFormError("Please fill out all job fields.");
                return;
            }
            addJob({
                title: jobTitle, clientId: currentUser.id, location: jobLocation,
                budget: Number(jobBudget), description: jobDescription,
                requiredProfession: jobProfession,
            });
            navigate('/search');
        }
    };

    const filteredMusic = useMemo(() => {
        if (!musicQuery) return [];
        return MUSIC_TRACKS.filter(track => track.toLowerCase().includes(musicQuery.toLowerCase()));
    }, [musicQuery]);

    const renderTalentForm = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Create a New Post</h2>
             <div>
                <label htmlFor="ai-prompt" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <i className="fas fa-magic text-[var(--accent-color)] mr-2"></i>AI Assistant
                </label>
                <textarea id="ai-prompt" rows={2} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    placeholder="Describe your post in a few words (e.g., 'a cool wedding DJ setup')..."
                ></textarea>
                <button onClick={handleGenerateWithAI} disabled={isGenerating || !aiPrompt.trim()}
                    className="mt-2 w-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGenerating ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>Generating...</> : 'Generate with AI ✨'}
                </button>
                {aiError && <p className="text-red-500 text-xs mt-2 text-center">{aiError}</p>}
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div><span className="flex-shrink mx-4 text-xs text-gray-400 dark:text-gray-500">OR WRITE YOUR OWN</span><div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div>
                <label htmlFor="post-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Post Caption</label>
                <textarea id="post-text" rows={5} value={gigText} onChange={(e) => setGigText(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    placeholder="Write a caption for your post..."
                ></textarea>
            </div>
             <div>
                <label htmlFor="upload-media" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Photo</label>
                {isUploading ? (
                    <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md min-h-[150px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
                    </div>
                ) : gigImage ? (
                    <div className="mt-1 relative"><img src={gigImage} alt="Preview" className="w-full rounded-md object-cover" /><button onClick={() => setGigImage(null)} className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center"><i className="fas fa-times"></i></button></div>
                ) : (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"><div className="space-y-1 text-center"><i className="fas fa-photo-video mx-auto h-12 w-12 text-gray-400"></i><div className="flex text-sm text-gray-600 dark:text-gray-400"><label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-black rounded-md font-medium text-black dark:text-white hover:text-opacity-80"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p></div></div>
                )}
            </div>
            <div>
                 <label htmlFor="add-music" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Music 🎵</label>
                {selectedMusic ? (
                    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"><span className="text-sm font-medium">{selectedMusic}</span><button onClick={() => setSelectedMusic('')} className="text-red-500 hover:text-red-700"><i className="fas fa-times-circle"></i></button></div>
                ) : (
                    <div className="relative">
                        <input id="add-music" type="text" placeholder="Search for a track..." value={musicQuery} onChange={(e) => setMusicQuery(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none" />
                         {musicQuery && filteredMusic.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                {filteredMusic.map(track => (<div key={track} onClick={() => { setSelectedMusic(track); setMusicQuery(''); }} className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">{track}</div>))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    const renderClientForm = () => (
        <div className="space-y-6">
             <h2 className="text-xl font-bold">Post a New Job</h2>
             <div>
                <label htmlFor="ai-prompt" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <i className="fas fa-magic text-[var(--accent-color)] mr-2"></i>AI Assistant
                </label>
                <textarea id="ai-prompt" rows={2} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    placeholder="Describe the job you need done... (e.g., 'photographer for a wedding in CPT')"
                ></textarea>
                <button onClick={handleGenerateWithAI} disabled={isGenerating || !aiPrompt.trim()}
                    className="mt-2 w-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGenerating ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>Generating...</> : 'Generate with AI ✨'}
                </button>
                {aiError && <p className="text-red-500 text-xs mt-2 text-center">{aiError}</p>}
            </div>
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div><span className="flex-shrink mx-4 text-xs text-gray-400 dark:text-gray-500">OR FILL MANUALLY</span><div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>
             <div>
                <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                <input id="job-title" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    placeholder="e.g., Wedding Photographer"
                />
            </div>
            <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description</label>
                <textarea id="job-description" rows={5} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    placeholder="Describe the job requirements in detail..."
                ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="job-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    <input id="job-location" type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                        placeholder="e.g., Sandton, JHB"
                    />
                </div>
                <div>
                    <label htmlFor="job-budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget (R)</label>
                    <input id="job-budget" type="number" value={jobBudget} onChange={(e) => setJobBudget(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                        placeholder="e.g., 5000"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="job-profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Profession</label>
                <select id="job-profession" value={jobProfession} onChange={(e) => setJobProfession(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none">
                    <option value="">Select a profession...</option>
                    {PROFESSIONS.map(prof => <option key={prof} value={prof}>{prof}</option>)}
                </select>
            </div>
        </div>
    );

    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="pt-2">
                {isTalent ? renderTalentForm() : renderClientForm()}
                
                {formError && <p className="text-red-500 text-sm mt-4 text-center">{formError}</p>}

                 <button
                    onClick={handlePost}
                    disabled={isTalent ? !gigText.trim() : !jobTitle.trim()}
                    className="mt-6 w-full border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold py-3 px-4 rounded-lg text-lg hover:bg-[var(--accent-color)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isTalent ? 'Post' : 'Post Job'}
                </button>
            </div>
        </div>
    );
};

export default CreateView;