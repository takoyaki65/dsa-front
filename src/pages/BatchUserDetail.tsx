import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBatchEvaluationUserDetail, fetchSubmissionResultDetail, fetchProblems, fetchBatchSubmission, fetchUserInfo } from '../api/GetAPI';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';
import { EvaluationDetail, Problem, SubmissionSummary, BatchSubmissionRecord, SubmissionSummaryStatus } from '../types/Assignments';
import styled from 'styled-components';
import JudgeResultsViewer from '../components/JudgeResultsViewer';
import { User } from '../types/user';

const BatchUserDetail: React.FC = () => {
  const { batchId, userId } = useParams<{ batchId: string; userId: string }>();
  console.log("batchId: ", batchId);
  console.log("userId: ", userId);
  const { token } = useAuth();
  const { apiClient } = useApiClient();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [lectureId, setLectureId] = useState<number | null>(null);
  const [batchDetail, setBatchDetail] = useState<EvaluationDetail | null>(null);
  const [assignmentId2SubmissionSummary, setAssignmentId2SubmissionSummary] = useState<{ [key: number]: SubmissionSummary | null }>({});
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [currentSubmissionSummary, setCurrentSubmissionSummary] = useState<SubmissionSummary | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const [expandedRows, setExpandedRows] = useState<number[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      if (!batchId || !userId) return;

      // バッチ採点のエントリを取得
      const batchSubmission = await apiClient({ apiFunc: fetchBatchSubmission, args: [parseInt(batchId)]});
      if (batchSubmission) {
        setLectureId(batchSubmission.lecture_id);
      }

      if (lectureId) {
        // 課題情報を取得
        const problemsData = await apiClient({apiFunc: fetchProblems, args: [lectureId, true]});
        setProblems(problemsData);
      }

      // 特定のバッチ採点の特定の学生の詳細を取得
      const userBatchDetail = await apiClient({apiFunc: fetchBatchEvaluationUserDetail, args: [parseInt(batchId), parseInt(userId)]});
      if (userBatchDetail) {
        setBatchDetail(userBatchDetail);

        // 各課題の採点結果の詳細を取得
        userBatchDetail.submission_summary_list.forEach(async (SubmissionSummaryStatus) => {
          const submission_summary_with_detail = await apiClient({apiFunc: fetchSubmissionResultDetail, args: [SubmissionSummaryStatus.submission_id]});
          setAssignmentId2SubmissionSummary(prev => ({...prev, [SubmissionSummaryStatus.assignment_id]: submission_summary_with_detail}));
        });
      }

      // ユーザー情報を取得
      const userInfo = await apiClient({apiFunc: fetchUserInfo, args: [parseInt(userId)]});
      if (userInfo) {
        setUserInfo(userInfo);
      }
    }
    fetchData();
  }, [batchId, userId]);

  const handleCheckListRowClick = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setCurrentSubmissionSummary(assignmentId2SubmissionSummary[assignmentId]);
  }

  const toggleRow = (id: number) => {
    setExpandedRows(prevExpandedRows =>
      prevExpandedRows.includes(id)
          ? prevExpandedRows.filter(rowId => rowId !== id)
          : [...prevExpandedRows, id]
    );
  }

  if (!batchDetail) return <div>Loading...</div>;

  console.log("submit_date: ", batchDetail.submit_date);
  console.log("type of submit_date: ", typeof batchDetail.submit_date);

  return (
    <div>
      <h1>バッチ採点結果: ユーザー {userId} ({userInfo?.username})</h1>
      <p>バッチID: {batchId}</p>
      <p>提出日時: {batchDetail.submit_date instanceof Date ? batchDetail.submit_date.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-') : new Date(batchDetail.submit_date!).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-')} </p>
      <h2>課題別結果</h2>
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
              <th key={index} onClick={() => handleCheckListRowClick(problem.assignment_id)}>
                {// problem.assignment_idから該当するSubmissionSummaryのresultを取得
                  assignmentId2SubmissionSummary[problem.assignment_id]?.result
                }
              </th>
            ))}
          </tr>
        </tbody>
      </table>

      <h2>チェックリスト</h2>
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
          {currentSubmissionSummary?.evaluation_summary_list.map((evaluation, index) => (
            <React.Fragment key={evaluation.id}>
              <CheckListRow>
                <td>
                  <ExpandButton onClick={() => toggleRow(evaluation.id)}>
                    {expandedRows.includes(evaluation.id) ? '▼' : '▶'}
                  </ExpandButton>
                </td>
                <td>{evaluation.eval_description}</td>
                <td>{evaluation.result}</td>
                <td>{evaluation.timeMS}ms</td>
                <td>{evaluation.memoryKB}KB</td>
              </CheckListRow>
              {expandedRows.includes(evaluation.id) && (
                <ExpandedRow>
                  <td colSpan={5}>
                    <JudgeResultsViewer results={evaluation.judge_result_list} />
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
