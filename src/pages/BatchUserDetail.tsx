import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBatchSubmissionStatus, fetchBatchSubmissionUserUploadedFile, fetchEvaluationStatus, fetchLectureEntry, fetchProblemDetail, fetchSubmissionResultDetail, fetchUserInfo } from '../api/GetAPI';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';
import { Problem, EvaluationStatus, Lecture, TestCases } from '../types/Assignments';
import styled from 'styled-components';
import JudgeResultsViewer from '../components/JudgeResultsViewer';
import { User } from '../types/user';
import { FileRecord } from '../types/Assignments';
import CodeBlock from '../components/CodeBlock';
import OfflineFileDownloadButton from '../components/OfflineFileDownloadButton';


const BatchUserDetail: React.FC = () => {
  const { batchId, userId } = useParams<{ batchId: string; userId: string }>();
  console.log("batchId: ", batchId);
  console.log("userId: ", userId);
  const { token } = useAuth();
  const { apiClient } = useApiClient();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [lectureEntry, setLectureEntry] = useState<Lecture | null>(null);
  const [evaluationStatus, setEvaluationStatus] = useState<EvaluationStatus | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [testCaseId2TestCase, setTestCaseId2TestCase] = useState<Map<number, TestCases>>(new Map());


  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
  const [selectedUploadedFile, setSelectedUploadedFile] = useState<string>('');


  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (!batchId || !userId) return;
      try {

        // バッチ採点のエントリを取得
        const batchSubmission = await apiClient({ apiFunc: fetchBatchSubmissionStatus, args: [parseInt(batchId)] });
        
        const lectureEntry = await apiClient({ apiFunc: fetchLectureEntry, args: [batchSubmission.lecture_id] });
        setLectureEntry(lectureEntry);

        let problemsData: Problem[] = [];
        // 課題情報を取得
        for (const problem of lectureEntry.problems){
          const problemDetail = await apiClient({ apiFunc: fetchProblemDetail, args: [problem.lecture_id, problem.assignment_id, true] });
          problemsData.push(problemDetail);
        }
        setProblems(problemsData);

        // 特定のバッチ採点の特定の学生の詳細を取得
        const evaluationStatus = await apiClient({ apiFunc: fetchEvaluationStatus, args: [parseInt(batchId), parseInt(userId)] });
        setEvaluationStatus(evaluationStatus);

        if (evaluationStatus.upload_file_exists) {
          // アップロードされたファイルを取得
          const file_list = await apiClient({ apiFunc: fetchBatchSubmissionUserUploadedFile, args: [parseInt(batchId), parseInt(userId)] });
          setUploadedFiles(file_list);
        }

        // テストケースを取得
        const testCaseId2TestCase = new Map<number, TestCases>();
        for (const problem of problemsData) {
          for (const test_case of problem.detail?.test_cases ?? []) {
            testCaseId2TestCase.set(test_case.id, test_case);
          }
        }
        setTestCaseId2TestCase(testCaseId2TestCase);

        const newUserInfo = await apiClient({ apiFunc: fetchUserInfo, args: [parseInt(userId)] });
        setUserInfo(newUserInfo);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        if (problems.length > 0 && evaluationStatus?.submissions.length! > 0) {
          setSelectedId(0);
        }
        setIsLoading(false);
      }
    };
    fetchData();
  }, [batchId, userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCheckListRowClick = (index: number) => {
    setSelectedId(index);
  }

  const getSubmissionStatus = (status: "submitted" | "delay" | "non-submitted" | null) => {
    switch (status) {
      case "submitted":
        return '提出済み';
      case "delay":
        return '遅延';
      case "non-submitted":
        return '未提出';
      default:
        return '不明';
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows(prevExpandedRows =>
      prevExpandedRows.includes(id)
          ? prevExpandedRows.filter(rowId => rowId !== id)
          : [...prevExpandedRows, id]
    );
  }

  const handleUploadedFileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUploadedFile(event.target.value);
  };

  const getSelectedUploadedFileContent = () => {
    const file = uploadedFiles.find((file) => file.name === selectedUploadedFile);
    return file?.content as string;
  };

  console.log("lectureEntry: ", lectureEntry);
  console.log("problems: ", problems);

  return (
    <div>
      <h1>バッチ採点結果: ユーザー {userId} ({userInfo?.username})</h1>
      <p>バッチID: {batchId}</p>
      <p>提出日時: {evaluationStatus?.submit_date instanceof Date ? evaluationStatus?.submit_date.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-') : new Date(evaluationStatus?.submit_date!).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-')} </p>
      <p>ステータス: {getSubmissionStatus(evaluationStatus?.status ?? null)}</p>
      <p>レポート: {evaluationStatus?.report_exists ? '提出済み' : '未提出'}</p>
      <h2>課題別結果</h2>
      { problems.length > 0 && (
      <table>
        <thead>
          <tr>
            {problems.map((problem, index) => (
              <th>{problem.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {problems.map((problem, index) => (
              <th key={index} onClick={() => handleCheckListRowClick(index)}>
                {// problem.assignment_idから該当するSubmissionSummaryのresultを取得
                  evaluationStatus?.submissions[index]?.result
                }
              </th>
            ))}
          </tr>
        </tbody>
      </table>
      )}

      <h2>チェックリスト ({selectedId !== null && problems[selectedId]?.title})</h2>
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
          {selectedId !== null && evaluationStatus?.submissions[selectedId].judge_results.map((judge_result, index) => (
            <React.Fragment key={judge_result.id}>
                <CheckListRow key={judge_result.id}>
                  <td>
                    <ExpandButton onClick={() => toggleRow(judge_result.id)}>
                      {expandedRows.includes(judge_result.id) ? '▼' : '▶'}
                    </ExpandButton>
                  </td>
                  <td>{testCaseId2TestCase.get(judge_result.testcase_id)?.description || ''}</td>
                  <td>{judge_result.result}</td>
                  <td>{judge_result.timeMS}ms</td>
                  <td>{judge_result.memoryKB}KB</td>
                </CheckListRow>
                {expandedRows.includes(judge_result.id) && (
                  <ExpandedRow>
                  <td colSpan={5}>
                    <JudgeResultsViewer result={judge_result} testCase={testCaseId2TestCase.get(judge_result.testcase_id)!} />
                  </td>
                </ExpandedRow>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </CheckListTable>

      <h2>提出されたファイル一覧</h2>
      <ul>
        {uploadedFiles.filter(file => file.content instanceof Blob).map(file => (
          <li key={file.name}>
            <OfflineFileDownloadButton file={file} />
          </li>
        ))}
      </ul>
      <select onChange={handleUploadedFileSelect} value={selectedUploadedFile}>
        <option value="">ファイルを選択してください</option>
        {uploadedFiles.filter(file => typeof file.content === 'string').map(file => (
          <option key={file.name} value={file.name}>{file.name}</option>
        ))}
      </select>
      <CodeBlock code={getSelectedUploadedFileContent()} fileName={selectedUploadedFile} />
    </div>
  );

};

export default BatchUserDetail;

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
