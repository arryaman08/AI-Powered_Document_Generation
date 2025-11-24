import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await register(email, password);
                alert("Registration successful! Please log in.");
                setIsRegister(false);
            } else {
                const { data } = await login(email, password);
                localStorage.setItem('token', data.access_token);
                navigate('/dashboard');
            }
        } catch (err) {
            alert("Error: " + err.response?.data?.detail || "Failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-blue-50">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">{isRegister ? "Register" : "Login"}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full border p-2 rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">{isRegister ? "Sign Up" : "Log In"}</button>
                </form>
                <button className="w-full mt-4 text-sm text-blue-600 underline" onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "Already have an account? Log In" : "Need an account? Register"}
                </button>
            </div>
        </div>
    );
}