import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import { SubAssignmentDropdown, SubAssignmentDetail } from '../types/Assignments';
import { fetchAssignmentDescription, fetchRequiredFiles, fetchSubAssignmentDetail, fetchSubAssignments } from '../api/GetAPI';
import Dropdown from '../components/Dropdown';
import CodeBlock from '../components/CodeBlock';
import Accordion from '../components/Accordion';
import FileUploadBox from '../components/FileUploadBox';
import { ProgressMessage } from '../types/Assignments';
import ProgressBar from '../components/ProgressBar';
import useApiClient from '../hooks/useApiClient';
import { kStringMaxLength } from 'buffer';
import { stringify } from 'querystring';
import { submitAssignment } from 'api/PostAPI';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const SubmissionPage: React.FC = () => {
	const { lectureId, assignmentId } = useParams<{ lectureId: string; assignmentId: string }>();
	const [description, setDescription] = useState<string>('');
	const [requiredFiles, setRequiredFiles] = useState<string[]>([]);
	const { apiClient } = useApiClient();
	const [hasError, setHasError] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (lectureId && assignmentId) {
					const description = await apiClient({ apiFunc: fetchAssignmentDescription, args: [parseInt(lectureId), parseInt(assignmentId), false] });
					setDescription(description);

					const filesData = await apiClient({ apiFunc: fetchRequiredFiles, args: [parseInt(lectureId), parseInt(assignmentId), false] });
					setRequiredFiles(filesData);
				}
			} catch (error) {
				setHasError(true);
				console.error('データの取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．', error);
			}
		};
		fetchData();
	}, [lectureId, assignmentId, apiClient]);

	const handleSubmit = async (files: File[]) => {
		if (lectureId && assignmentId) {
			try {
				const submissionRecord = await apiClient({ apiFunc: submitAssignment, args: [parseInt(lectureId), parseInt(assignmentId), false, files] });
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
				<ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
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
