import React, { useEffect, useState } from 'react';
import { fetchMySubmissionList, fetchSubmissionStatus, fetchProblemEntry } from '../api/GetAPI';
import { JudgeProgressAndStatus, SubmissionProgressStatus } from '../types/Assignments'
import { Link } from 'react-router-dom';
import useApiClient from '../hooks/useApiClient';
import { useAuth } from '../context/AuthContext';
const SubmissionStatusOfMe: React.FC = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<JudgeProgressAndStatus[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { apiClient } = useApiClient();

  const [submissionTitles, setSubmissionTitles] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await apiClient({ apiFunc: fetchMySubmissionList, args: [page] });
        setSubmissions(data);

        const titles: {[key: string]: string} = {};
        for (const submission of data) {
          const key = `${submission.lecture_id}-${submission.assignment_id}-${submission.for_evaluation}`;
          if (!titles[key]) {
            try {
              const problemEntry = await apiClient({ 
                apiFunc: fetchProblemEntry, 
                args: [submission.lecture_id, submission.assignment_id, submission.for_evaluation] 
              });
              titles[key] = problemEntry.title;
            } catch (err) {
              console.error('課題タイトルの取得に失敗しました', err);
              titles[key] = '不明な課題';
            }
          }
        }
        setSubmissionTitles(titles);

        setError(null);
      } catch (err) {
        setError('提出状況の取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [page, token]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const updateSubmissions = await Promise.all(
        submissions.map(async (submission) => {
          if (submission.progress !== SubmissionProgressStatus.Done) {
            try {
              return await apiClient({ apiFunc: fetchSubmissionStatus, args: [submission.id] });
            } catch (err) {
              console.error('提出状況の取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．', err);
              return submission;
            }
          } else {
            return submission;
          }
        })
      );
      setSubmissions(updateSubmissions);
    }, 2000);

    // クリーンアップ関数
    return () => clearInterval(interval);
  }, [submissions, token]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  if (loading) return <div>読み込み中...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>自分の提出</h1>
      <div>
        <p>注) ここで行った提出で、課題の評価はされません。</p>
        <p>注) 問題無く採点可能であることを確認した後、manabaでソースコードとレポートPDFを提出してください。</p>
      </div>
      <div>
        <button onClick={handlePrev} disabled={page === 1}>Prev</button>
        <button onClick={handleNext} disabled={submissions.length < 20}>Next</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>提出日時</th>
            <th>課題</th>
            <th>ユーザ</th>
            <th>得点</th>
            <th>結果</th>
            <th>実行時間</th>
            <th>メモリ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.ts.toString()}</td>
              <td>{submissionTitles[`${submission.lecture_id}-${submission.assignment_id}-${submission.for_evaluation}`]}</td>
              <td>{submission.user_id}</td>
              <td>{submission.score}</td>
              <td>{submission.result}</td>
              <td>{submission.timeMS}</td>
              <td>{submission.memoryKB}</td>
              <td>
                <Link to={`/result/${submission.id}`}>詳細</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default SubmissionStatusOfMe;