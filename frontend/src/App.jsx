import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import Editor from './pages/Editor';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/create" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
                    <Route path="/editor/:id" element={<PrivateRoute><Editor /></PrivateRoute>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;