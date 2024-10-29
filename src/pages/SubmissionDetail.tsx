import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSubmissionFiles, fetchSubmissionStatus, fetchProblemEntry, fetchProblemDetail } from '../api/GetAPI';
import { FileRecord, TestCases } from '../types/Assignments';
import useApiClient from '../hooks/useApiClient';
import CodeBlock from '../components/CodeBlock';
import { fetchSubmissionResultDetail } from '../api/GetAPI';
import { Submission, Problem } from '../types/Assignments';
import styled from 'styled-components';
import JudgeResultsViewer from '../components/JudgeResultsViewer';
import { useAuth } from '../context/AuthContext';
import OfflineFileDownloadButton from '../components/OfflineFileDownloadButton';

const SubmissionDetail: React.FC = () => {
    const { token } = useAuth();
    const { submissionId } = useParams<{ submissionId: string }>();
    const [ problem, setProblem ] = useState<Problem | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
    const [arrangedFiles, setArrangedFiles] = useState<FileRecord[]>([]);
    const { apiClient } = useApiClient();
    const [selectedUploadedFile, setSelectedUploadedFile] = useState<string>('');
    const [selectedArrangedFile, setSelectedArrangedFile] = useState<string>('');
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [testCaseId2TestCases, setTestCaseId2TestCases] = useState<Map<number, TestCases>>(new Map());

    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const uploadedData = await apiClient({ apiFunc: fetchSubmissionFiles, args: [parseInt(submissionId!), 'uploaded']})
                const arrangedData = await apiClient({ apiFunc: fetchSubmissionFiles, args: [parseInt(submissionId!), 'arranged']})
                setUploadedFiles(uploadedData);
                setArrangedFiles(arrangedData);
            } catch (error) {
                setError('Failed to fetch submission detail');
            }
        };

        const fetchSubmission = async () => {
            try {
                const submission = await apiClient({ apiFunc: fetchSubmissionResultDetail, args: [parseInt(submissionId!)] });
                setSubmission(submission);

                const problemInfo = await apiClient({ apiFunc: fetchProblemDetail, args: [submission.lecture_id, submission.assignment_id, submission.eval] });
                setProblem(problemInfo);

                const testCaseId2TestCases = new Map<number, TestCases>();

                for (const testCase of problemInfo.detail?.test_cases || []) {
                    // testCase.id(key) -> testCase(value)
                    testCaseId2TestCases.set(testCase.id, testCase);
                }

                setTestCaseId2TestCases(testCaseId2TestCases);
            } catch (error) {
                setError('Failed to fetch submission detail');
            }
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                fetchFiles();
                fetchSubmission();
            } catch (error) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [submissionId, token]);

    const handleUploadedFileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUploadedFile(event.target.value);
    };

    const handleArrangedFileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArrangedFile(event.target.value);
    };

    const getSelectedUploadedFileContent = () => {
        const file = uploadedFiles.find((file) => file.name === selectedUploadedFile);
        return file?.content as string;
    };

    const getSelectedArrangedFileContent = () => {
        const file = arrangedFiles.find((file) => file.name === selectedArrangedFile);
        return file?.content as string;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const toggleRow = (id: number) => {
        setExpandedRows(prevExpandedRows =>
            prevExpandedRows.includes(id)
                ? prevExpandedRows.filter(rowId => rowId !== id)
                : [...prevExpandedRows, id]
        );
    };

    return (
        <div>
            <h1>提出 #{submissionId} (課題: {problem?.title || '課題名不明'})</h1>
            <h1>提出されたファイル一覧</h1>
            <select onChange={handleUploadedFileSelect} value={selectedUploadedFile}>
                <option value="">ファイルを選択してください</option>
                {uploadedFiles.filter(file => typeof file.content === 'string').map(file => (
                    <option key={file.name} value={file.name}>{file.name}</option>
                ))}
            </select>
            <CodeBlock code={getSelectedUploadedFileContent()} fileName={selectedUploadedFile} />
            <ul>
                {uploadedFiles.filter(file => file.content instanceof Blob).map(file => (
                    <li key={file.name}>
                        <OfflineFileDownloadButton file={file} />
                    </li>
                ))}
            </ul>
            <h1>用意されたファイル一覧</h1>
            <select onChange={handleArrangedFileSelect} value={selectedArrangedFile}>
                <option value="">ファイルを選択してください</option>
                {arrangedFiles.filter(file => typeof file.content === 'string').map(file => (
                    <option key={file.name} value={file.name}>{file.name}</option>
                ))}
            </select>
            <CodeBlock code={getSelectedArrangedFileContent()} fileName={selectedArrangedFile} />
            <ul>
                {arrangedFiles.filter(file => file.content instanceof Blob).map(file => (
                    <li key={file.name}>
                        <OfflineFileDownloadButton file={file} />
                    </li>
                ))}
            </ul>

            {
                submission && problem && (
                    <div>
                        <h1>提出結果</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th>提出日時</th>
                                    <td>{submission?.ts.toString()}</td>
                                </tr>
                                <tr>
                                    <th>問題</th>
                                    <td>{problem?.title}</td>
                                </tr>
                                <tr>
                                    <th>ユーザ</th>
                                    <td>{submission?.user_id}</td>
                                </tr>
                                <tr>
                                    <th>得点</th>
                                    <td>{submission?.score}</td>
                                </tr>
                                <tr>
                                    <th>結果</th>
                                    <td>{submission?.result}</td>
                                </tr>
                                <tr>
                                    <th>実行時間</th>
                                    <td>{submission?.timeMS}ms</td>
                                </tr>
                                <tr>
                                    <th>メモリ</th>
                                    <td>{submission?.memoryKB}KB</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            }

            <div>
                <h1>メッセージ</h1>
                <p>{submission?.message || 'なし'}</p>
                <p>{'detail: ' +submission?.detail || ''}</p>
            </div>

            <h1>チェックリスト</h1>
            <CheckListTable>
                <thead>
                    <tr>
                        <th></th>
                        <th>チェック項目</th>
                        <th>結果</th>
                        <th>実行時間</th>
                        <th>メモリ</th>
                    </tr>
                </thead>
                <tbody>
                    {submission?.judge_results.map((judge_result, index) => (
                        <React.Fragment key={index}>
                            <CheckListRow>
                                <td>
                                    <ExpandButton onClick={() => toggleRow(index)}>
                                        {expandedRows.includes(index) ? '▼' : '▶'}
                                    </ExpandButton>
                                </td>
                                <td>{testCaseId2TestCases.get(judge_result.testcase_id)?.description || ''}</td>
                                <td>{judge_result.result}</td>
                                <td>{judge_result.timeMS}ms</td>
                                <td>{judge_result.memoryKB}KB</td>
                            </CheckListRow>
                            {expandedRows.includes(index) && (
                                <ExpandedRow>
                                    <td colSpan={5}>
                                        <JudgeResultsViewer result={judge_result} testCase={testCaseId2TestCases.get(judge_result.testcase_id)!} />
                                    </td>
                                </ExpandedRow>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </CheckListTable>
        </div>
    );
};

export default SubmissionDetail;

const CheckListTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const CheckListRow = styled.tr`
    border-bottom: 1px solid #ddd;
`;

const ExpandedRow = styled.tr`
    background-color: #f9f9f9;
`;

const ExpandButton = styled.button`
    background-color: none;
    border: none;
    cursor: pointer;
    font-size: 1.2em;
`;
