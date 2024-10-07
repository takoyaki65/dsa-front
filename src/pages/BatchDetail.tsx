import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBatchSubmissionDetail, fetchUserInfo, fetchProblems, fetchLectures } from '../api/GetAPI'
import { BatchEvaluationDetail, EvaluationDetail, Problem, SubmissionSummaryStatus, StudentSubmissionStatus } from '../types/Assignments';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';
import { Link } from 'react-router-dom';
const BatchDetail: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batchDetail, setBatchDetail] = useState<BatchEvaluationDetail | null>(null);
  const [lectureName, setLectureName] = useState<string>('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userName, setUserName] = useState<{ [key: string]: string }>({});
  const { token } = useAuth();
  const { apiClient } = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      console.log("batch_id: ", batchId);
      if (batchId) {
        const detail = await apiClient({ apiFunc: fetchBatchSubmissionDetail, args: [parseInt(batchId)]});
        console.log(detail);
        if (detail) {
          setBatchDetail(detail);
          setLectureName("課題" + detail.lecture_id);
          const problemList = await apiClient({ apiFunc: fetchProblems, args: [detail.lecture_id, true]});
          setProblems(problemList);
        
          const userIds = detail.evaluation_detail_list.map(evaluation => evaluation.user_id);
          const userInfoPromises = userIds.map(id => apiClient({ apiFunc: fetchUserInfo, args: [id]}));
          const userInfos = await Promise.all(userInfoPromises);
          const userNameMap = userInfos.reduce((acc, user) => {
            if (user) {
              acc[user.user_id] = user.username;
            }
            return acc;
          }, {} as { [key: string]: string });
          setUserName(userNameMap);
        }
      }
    };
    fetchData();
  }, [batchId]);

  const getSubmissionStatus = (status: StudentSubmissionStatus) => {
    switch (status) {
      case StudentSubmissionStatus.SUBMITTED:
        return '提出済み';
      case StudentSubmissionStatus.DELAY:
        return '遅延';
      case StudentSubmissionStatus.NON_SUBMITTED:
        return '未提出';
      default:
        return '不明';
    }
  };

  const getResultStatus = (result: SubmissionSummaryStatus | null) => {
    return result || '未評価';
  };

  if (!batchDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>採点履歴</h1>
      <p>バッチID: {batchDetail.batch_id}</p>
      <p>提出日時: {batchDetail.ts.toLocaleString()}</p>
      <p>課題{batchDetail.lecture_id}</p>
      <table>
        <thead>
          <th>ユーザー</th>
          <th>レポート</th>
          {problems.map(problem => (
            <th>{problem.title}</th>
          ))}
          <th>採点結果</th>
          <th>提出状況</th>
          <th></th>
        </thead>
        <tbody>
          {batchDetail.evaluation_detail_list.map((evaluation_detail) => (
            <tr key={evaluation_detail.user_id}>
              <td>{userName[evaluation_detail.user_id]} <br/> {evaluation_detail.user_id}</td>
              <td>{evaluation_detail.report_url ? '提出' : '未提出'}</td>
              {problems.map(problem => {
                const submission = evaluation_detail.submission_summary_list.find(s => s.assignment_id === problem.assignment_id);
                return <td key={problem.assignment_id}>{submission ? submission.result : '未提出'}</td>
              })}
              <td>{getResultStatus(evaluation_detail.result)}</td>
              <td>{getSubmissionStatus(evaluation_detail.status)}</td>
              <td>
                <Link to={`/batch/result/${batchId}/user/${evaluation_detail.user_id}`}>詳細</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );      
};

export default BatchDetail;
