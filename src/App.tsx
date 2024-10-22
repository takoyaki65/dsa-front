import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import SubmissionPage from './pages/ProblemPage';
import RegisterPage from './pages/UserRegisterationPage';
import LoginPage from './pages/LoginPage';
import SubmissionStatusOfMe from './pages/SubmissionStatusOfMe';
import { useAuth } from './context/AuthContext';
import SubmissionDetail from './pages/SubmissionDetail';
import FormatCheckSubmission from './pages/FormatCheckSubmission';
import BatchSubmission from './pages/BatchSubmission';
import BatchStatus from './pages/BatchStatus';
import BatchDetail from './pages/BatchDetail';
import BatchUserDetail from './pages/BatchUserDetail';
import StudentPassChangePage from './pages/StudentPassChangePage';
import UserManagementPage from './pages/UserManagementPage';
import UserArrangePage from './pages/UserArrangePage';
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
					<Route path="/submission/:lectureId/:assignmentId" element={<PrivateRoute element={<SubmissionPage />} />} />
					<Route path="/status/me" element={<PrivateRoute element={<SubmissionStatusOfMe />} />} />
					<Route path="/result/:submissionId" element={<PrivateRoute element={<SubmissionDetail />} />} />
					<Route path="/users/passChange" element={<PrivateRoute element={<StudentPassChangePage />} />} />
					<Route path="/format-check" element={<PrivateRoute element={<FormatCheckSubmission />} />} />
					<Route path="/batch/submit" element={<PrivateRoute element={<BatchSubmission />} />} />
					<Route path="/batch/status" element={<PrivateRoute element={<BatchStatus />} />} />
					<Route path="/batch/result/:batchId" element={<PrivateRoute element={<BatchDetail />} />} />
					<Route path="/batch/result/:batchId/user/:userId" element={<PrivateRoute element={<BatchUserDetail />} />} />
					<Route path="/users/management" element={<PrivateRoute element={<UserManagementPage />} />} />
					<Route path="/users/edit/:userId" element={<PrivateRoute element={<UserArrangePage />} />} />
					<Route path="*" element={<h1>Not Found</h1>} />
				</Routes>
				</div>
			</div>
	);
};

export default App;
