import React, { useEffect, useState } from 'react';
import { getProjects } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Presentation, LogOut } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getProjects().then(res => setProjects(res.data));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Projects</h1>
                <div className="space-x-4">
                    <Link to="/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ New Project</Link>
                    <button onClick={handleLogout} className="text-red-600 hover:underline"><LogOut className="inline w-4 h-4"/> Logout</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map(proj => (
                    <Link key={proj.id} to={`/editor/${proj.id}`} className="block bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <div className="flex items-center mb-4">
                            {proj.doc_type === 'docx' ? <FileText className="text-blue-500 mr-2"/> : <Presentation className="text-orange-500 mr-2"/>}
                            <span className="font-bold text-lg">{proj.title}</span>
                        </div>
                        <p className="text-gray-500 text-sm">Type: {proj.doc_type.toUpperCase()}</p>
                    </Link>
                ))}
                {projects.length === 0 && <p className="text-gray-500">No projects yet. Create one!</p>}
            </div>
        </div>
    );
}