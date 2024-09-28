import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import SubmissionPage from './pages/SubmissionPage';
import RegisterPage from './pages/UserRegisterationPage';
import LoginPage from './pages/LoginPage';
import UserDeletePage from './pages/UserDeletePage';
import { useAuth } from './context/AuthContext';

// ログインしているユーザーのみがアクセスできるページを作成するためのコンポーネント
// ログインしていないユーザーはログインページにリダイレクトされる
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
		const { token } = useAuth();
		return token ? element : <Navigate to="/login" replace />;
};


// アプリケーションのルートコンポーネント
const App: React.FC = () => {
	const { token } = useAuth();
    return (
			
			<div className="app">
				{token && <Sidebar />}
				<div className="content">
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/users/register" element={<PrivateRoute element={<RegisterPage />} />} />
					<Route path="/" element={<PrivateRoute element={<Home />} />} />
					<Route path="/submission/:problemNum" element={<PrivateRoute element={<SubmissionPage />} />} />
					<Route path="/users/delete" element={<PrivateRoute element={<UserDeletePage />} />} />
					<Route path="*" element={<h1>Not Found</h1>} />
				</Routes>
				</div>
			</div>
	);
};

export default App;
