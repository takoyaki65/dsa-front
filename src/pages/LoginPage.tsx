import React, { useState } from 'react';
import { login } from '../api/PostAPI';
import { LoginCredentials } from '../types/user';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' });
    const [error, setError] = useState<string>('');
    const { setToken, setUserId, setIsAdmin } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await login(credentials);
            setError('');
            setToken(result.access_token); 
            setUserId(result.user_id);
            setIsAdmin(result.is_admin); 
            window.location.href = '/';
        } catch (error) {
            console.error('Login failed:', error);
            setError(`ログインに失敗しました。: ${(error as any).response.data.detail}`);
        }
    };

    return (
        <div className="login-page">
            <h2>ログイン</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                <label htmlFor="username">ユーザー名:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                />
                </div>
                <div>
                <label htmlFor="password">パスワード:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                />
                </div>
                <button type="submit">ログイン</button>
            </form>
        </div>
    );
};

export default LoginPage;
