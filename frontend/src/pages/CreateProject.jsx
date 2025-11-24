import React, { useState } from 'react';
import { generateTemplate, createProject } from '../api';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function CreateProject() {
    const [title, setTitle] = useState('');
    const [context, setContext] = useState(''); // NEW STATE
    const [type, setType] = useState('docx');
    const [outline, setOutline] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAISuggest = async () => {
        if (!title) return alert("Enter a title first");
        setLoading(true);
        try {
            // Pass context to help the AI make a better outline
            const { data } = await generateTemplate(title, type, context);
            setOutline(data.outline);
        } catch (error) {
            alert("AI Generation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (outline.length === 0) return alert("Add at least one section");
        // Pass context to the backend for content generation
        await createProject({ title, doc_type: type, context, outline });
        navigate('/dashboard');
    };

    const updateOutline = (idx, val) => {
        const newOutline = [...outline];
        newOutline[idx] = val;
        setOutline(newOutline);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            
            <div className="space-y-4 bg-white p-6 rounded shadow">
                <div>
                    <label className="block text-sm font-bold mb-1">Topic / Title</label>
                    <input 
                        className="w-full border p-2 rounded" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="e.g., Market Analysis of EV Industry" 
                    />
                </div>

                {/* NEW SECTION: Context Input */}
                <div>
                    <label className="block text-sm font-bold mb-1">Tell me about your document</label>
                    <p className="text-xs text-gray-500 mb-2">Provide details, tone, or specific points you want covered so the AI generates better content.</p>
                    <textarea 
                        className="w-full border p-2 rounded h-24 resize-none" 
                        value={context} 
                        onChange={e => setContext(e.target.value)} 
                        placeholder="e.g. Make it formal, focus on Tesla and BYD, and include data from 2024. This is for a university assignment." 
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Format</label>
                    <select className="w-full border p-2 rounded" value={type} onChange={e => setType(e.target.value)}>
                        <option value="docx">Word Document (.docx)</option>
                        <option value="pptx">PowerPoint (.pptx)</option>
                    </select>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <h3 className="font-bold">Outline / Slides</h3>
                    <button onClick={handleAISuggest} disabled={loading} className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center">
                        {loading && <Loader2 className="animate-spin w-4 h-4 mr-2"/>} AI Suggest Outline
                    </button>
                </div>

                <div className="space-y-2">
                    {outline.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                            <span className="py-2 text-gray-500">{idx + 1}.</span>
                            <input className="flex-1 border p-2 rounded" value={item} onChange={e => updateOutline(idx, e.target.value)} />
                            <button className="text-red-500" onClick={() => setOutline(outline.filter((_, i) => i !== idx))}>x</button>
                        </div>
                    ))}
                    <button className="text-blue-600 text-sm hover:underline" onClick={() => setOutline([...outline, "New Section"])}>+ Add Manually</button>
                </div>

                <button onClick={handleCreate} className="w-full bg-blue-600 text-white p-3 rounded mt-6 font-bold hover:bg-blue-700">Generate Project</button>
            </div>
        </div>
    );
}