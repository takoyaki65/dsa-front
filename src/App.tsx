import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import SubmissionPage from './pages/SubmissionPage';
import RegisterPage from './pages/UserRegisterationPage';
import LoginPage from './pages/LoginPage';
import UserDeletePage from './pages/UserDeletePage';
import { useAuth } from './context/AuthContext';


const App: React.FC = () => {
	const { resetTimer } = useAuth(); // useAuthフックからresetTimer関数を取得
    useEffect(() => {
        const events = ['click', 'load', 'keydown'];
        // イベントリスナーを追加
        events.forEach(event => window.addEventListener(event, resetTimer));
        
        // クリーンアップ関数
        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [resetTimer]);

    return (
		<Router>
			<div className="app">
				<Sidebar />
				<div className="content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/submission/:problemNum" element={<SubmissionPage />} />
						<Route path="/users/register" element={<RegisterPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/users/delete" element={<UserDeletePage />} />
						<Route path="*" element={<h1>Not Found</h1>} />
					</Routes>
				</div>
			</div>
		</Router>
    );
};

export default App;
