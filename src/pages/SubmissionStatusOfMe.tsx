import React, { useEffect, useState } from 'react';
import { fetchSubmissionList, fetchSubmissionStatus, fetchProblemEntry } from '../api/GetAPI';
import { Submission, Problem } from '../types/Assignments'
import { Link } from 'react-router-dom';
import useApiClient from '../hooks/useApiClient';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/token';

const SubmissionStatusOfMe: React.FC = () => {
  const { token, role } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { apiClient } = useApiClient();

  const [id2problem, setId2Problem] = useState<{[key: string]: Problem}>({});

  const include_eval = (role === UserRole.student) ? false : true;
  const all = false;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await apiClient({ apiFunc: fetchSubmissionList, args: [page, include_eval, all] });
        setSubmissions(data);

        const dict: {[key: string]: Problem} = {};
        for (const submission of data) {
          const key = `${submission.lecture_id}-${submission.assignment_id}`;
          if (!dict[key]) {
            try {
              const problemEntry = await apiClient({ 
                apiFunc: fetchProblemEntry, 
                args: [submission.lecture_id, submission.assignment_id] 
              });
              dict[key] = problemEntry;
            } catch (err) {
              console.error('課題タイトルの取得に失敗しました', err);
              dict[key] = {
                lecture_id: submission.lecture_id,
                assignment_id: submission.assignment_id,
                title: '不明な課題',
                timeMS: 0,
                memoryMB: 0,
                detail: null
              };
            }
          }
        }
        setId2Problem(dict);
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
          if (submission.progress !== "done") {
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
              <td>{id2problem[`${submission.lecture_id}-${submission.assignment_id}`].title}</td>
              <td>{submission.user_id}</td>
              <td>{submission.score}</td>
              <td>{submission.result}</td>
              <td>{submission.timeMS}ms</td>
              <td>{submission.memoryKB}KB</td>
              <td>
                {submission.progress === "done" ?
                  <Link to={`/result/${submission.id}`}>詳細</Link> :
                  `${submission.completed_task}/${submission.total_task}...`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default SubmissionStatusOfMe;