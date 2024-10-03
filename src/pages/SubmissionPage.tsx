import { useParams, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import { fetchAssignmentDescription, fetchRequiredFiles } from '../api/GetAPI';
import FileUploadBox from '../components/FileUploadBox';
import useApiClient from '../hooks/useApiClient';
import { submitAssignment } from 'api/PostAPI';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../context/AuthContext';
const SubmissionPage: React.FC = () => {
	const { token } = useAuth();
	const { lectureId, assignmentId } = useParams<{ lectureId: string; assignmentId: string }>();
	const [description, setDescription] = useState<string>('');
	const [requiredFiles, setRequiredFiles] = useState<string[]>([]);
	const { apiClient } = useApiClient();
	const [hasError, setHasError] = useState<boolean>(false);
	const navigate = useNavigate();

	// ?evaluation={true|false}のパラメータを取得
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const evaluation = searchParams.get('evaluation') === 'true';

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (lectureId && assignmentId) {
					const description = await apiClient({ apiFunc: fetchAssignmentDescription, args: [parseInt(lectureId), parseInt(assignmentId), evaluation] });
					setDescription(description);

					const filesData = await apiClient({ apiFunc: fetchRequiredFiles, args: [parseInt(lectureId), parseInt(assignmentId), evaluation] });
					setRequiredFiles(filesData);
				}
			} catch (error) {
				setHasError(true);
				console.error('データの取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．', error);
			}
		};
		fetchData();
	}, [lectureId, assignmentId, token]);

	const handleSubmit = async (files: File[]) => {
		if (lectureId && assignmentId) {
			try {
				const submissionRecord = await apiClient({ apiFunc: submitAssignment, args: [parseInt(lectureId), parseInt(assignmentId), evaluation, files] });
				navigate('/status/me');
			} catch (error) {
				console.error('提出エラー: ', error);
			}
		}
	};

	if (hasError) {
		return <>
			<h1>Not Found</h1>
			<div>指定された課題は存在しないか，未公開です．</div>
		</>;
	}

	return (
		<div style={{ paddingBottom: '100px' }}>
			<div>
				<ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
					{description}
				</ReactMarkdown>
			</div>
			<div>
				<h2>必要なファイル</h2>
				<ul>
					{requiredFiles.map((file, index) => (
						<li key={index}>{file}</li>
					))}
				</ul>
			</div>
			<div>
				<h2>提出フォーム</h2>
				<FileUploadBox onSubmit={handleSubmit} requiredFiles={requiredFiles} />
			</div>
		</div>
	);
};

export default SubmissionPage;
