import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../types/user';
import { fetchLectureEntry, fetchBatchSubmissionDetail, fetchUserInfo } from '../api/GetAPI'
import { Lecture, BatchSubmission, SubmissionSummaryStatus, Problem } from '../types/Assignments';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';
import { Link } from 'react-router-dom';
const BatchDetail: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batchDetail, setBatchDetail] = useState<BatchSubmission | null>(null);
  const [lectureEntry, setLectureEntry] = useState<Lecture | null>(null);
  const [userDict, setUserDict] = useState<{ [key: string]: User }>({});
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { apiClient } = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("batch_id: ", batchId);
      if (batchId) {
        const detail = await apiClient({ apiFunc: fetchBatchSubmissionDetail, args: [parseInt(batchId)]});
        console.log(detail);
        if (detail) {
          const lectureEntry = await apiClient({ apiFunc: fetchLectureEntry, args: [detail.lecture_id]});
          console.log(lectureEntry);
          setLectureEntry(lectureEntry);
          setBatchDetail(detail);

          const userIds = detail.evaluation_statuses.map(evaluation => evaluation.user_id);
          const userInfoPromises = userIds.map(id => apiClient({ apiFunc: fetchUserInfo, args: [id]}));
          const userInfos = await Promise.all(userInfoPromises);
          const userDict = userInfos.reduce((acc, user) => {
            if (user) {
              acc[user.user_id] = user;
            }
            return acc;
          }, {} as { [key: string]: User });
          setUserDict(userDict);
        }
      }
    };
    fetchData();
    setLoading(false);
  }, [batchId]);

  const getSubmissionStatus = (status:"submitted" | "delay" | "non-submitted" ) => {
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

  const getResultStatus = (result: SubmissionSummaryStatus | null) => {
    return result || '未評価';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>採点履歴</h1>
      <p>バッチID: {batchDetail?.id!}</p>
      <p>提出日時: {batchDetail?.ts.toLocaleString()}</p>
      <p>{lectureEntry?.title}</p>
      <table>
        <thead>
          <th>ユーザー</th>
          <th>レポート</th>
          {lectureEntry?.problems.map(problem => (
            <th>{problem.title}</th>
          ))}
          <th>採点結果</th>
          <th>提出状況</th>
          <th></th>
        </thead>
        <tbody>
          {batchDetail?.evaluation_statuses.map((evaluation_detail) => (
            <tr key={evaluation_detail.user_id}>
              <td>{userDict[evaluation_detail.user_id]?.username} <br/> {evaluation_detail.user_id}</td>
              <td>{evaluation_detail.report_exists ? '提出' : '未提出'}</td>
              {lectureEntry?.problems.map(problem => {
                const submission = evaluation_detail.submissions.find(s => s.assignment_id === problem.assignment_id);
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
