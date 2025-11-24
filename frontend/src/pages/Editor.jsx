import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject, refineSection, sendFeedback, exportProject } from '../api';
import { ThumbsUp, ThumbsDown, Download, RefreshCcw } from 'lucide-react';

export default function Editor() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loadingMap, setLoadingMap] = useState({}); // Track loading per section

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        const { data } = await getProject(id);
        setProject(data);
    };

    const handleRefine = async (sectionId, instruction) => {
        setLoadingMap(prev => ({ ...prev, [sectionId]: true }));
        await refineSection(sectionId, instruction);
        await loadProject(); // Refresh content
        setLoadingMap(prev => ({ ...prev, [sectionId]: false }));
    };

    const handleFeedback = async (sectionId, type) => {
        await sendFeedback(sectionId, type, "");
        alert(`Marked as ${type}`);
    };

    const handleExport = () => {
        const token = localStorage.getItem('token');
        // Direct download link with auth header requires a trick or fetch-blob. 
        // For simplicity in this assignment, we construct a fetch call:
        fetch(exportProject(id), {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.title}.${project.doc_type}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
    };

    if (!project) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Outline */}
            <div className="w-64 bg-white border-r p-4 overflow-y-auto hidden md:block">
                <h3 className="font-bold mb-4 text-gray-700">Structure</h3>
                <ul className="space-y-2 text-sm">
                    {project.sections.map((sec, idx) => (
                        <li key={sec.id} className="text-gray-600 truncate">{idx + 1}. {sec.heading}</li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">{project.title}</h1>
                        <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700">
                            <Download className="w-4 h-4 mr-2"/> Export .{project.doc_type}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {project.sections.map((sec) => (
                            <SectionCard 
                                key={sec.id} 
                                section={sec} 
                                onRefine={handleRefine} 
                                onFeedback={handleFeedback}
                                loading={loadingMap[sec.id]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionCard({ section, onRefine, onFeedback, loading }) {
    const [instruction, setInstruction] = useState('');

    return (
        <div className="bg-white p-6 rounded shadow border border-gray-200">
            <h3 className="text-lg font-bold text-blue-800 mb-2">{section.heading}</h3>
            
            <div className="bg-gray-50 p-4 rounded mb-4 min-h-[100px] whitespace-pre-wrap text-gray-700">
                {loading ? "AI is refining..." : section.content || "Content generating..."}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-t pt-4">
                <div className="flex-1 w-full">
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 border rounded px-3 py-1 text-sm" 
                            placeholder="Refine instruction (e.g., 'Make concise')" 
                            value={instruction}
                            onChange={e => setInstruction(e.target.value)}
                        />
                        <button 
                            onClick={() => { onRefine(section.id, instruction); setInstruction(''); }}
                            disabled={loading}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 flex items-center"
                        >
                            <RefreshCcw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`}/> Refine
                        </button>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => onFeedback(section.id, 'like')} className="p-1 hover:bg-gray-100 rounded text-green-600"><ThumbsUp className="w-5 h-5"/></button>
                    <button onClick={() => onFeedback(section.id, 'dislike')} className="p-1 hover:bg-gray-100 rounded text-red-600"><ThumbsDown className="w-5 h-5"/></button>
                </div>
            </div>
        </div>
    );
}