// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { fetchBatchSubmissionStatus, fetchBatchSubmissionList, fetchUserInfo } from '../api/GetAPI';
// import { BatchSubmission } from '../types/Assignments';
// import { User } from '../types/user';
// import { useAuth } from '../context/AuthContext';
// import useApiClient from '../hooks/useApiClient';

// const BatchStatus: React.FC = () => {
//   const [submissions, setSubmissions] = useState<BatchSubmission[]>([]);
//   const [userDict, setUserDict] = useState<{ [key: string]: User }>({});
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const { token } = useAuth();
//   const { apiClient } = useApiClient();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       const submissionList = await apiClient({ apiFunc: fetchBatchSubmissionList, args: [page] });
//       setSubmissions(submissionList);

//       const userPromises = submissionList.map(async (submission) => {
//         if (userDict[submission.user_id]) {
//           return userDict[submission.user_id];
//         }
//         const user = await apiClient({ apiFunc: fetchUserInfo, args: [submission.user_id] });
//         return user;
//       });
//       const userResults = await Promise.all(userPromises);

//       const newUsers = userResults.reduce((acc, user) => {
//         if (user) {
//           acc[user.user_id] = user;
//         }
//         return acc;
//       }, {} as { [key: string]: User });
//       setUserDict(newUsers);
//       setLoading(false);
//     };

//     fetchData();
//   }, [page]);

//   useEffect(() => {
//     const intervalIds: NodeJS.Timeout[] = [];

//     submissions.forEach(submission => {
//       if (submission.complete_judge !== submission.total_judge) {
//         const intervalId = setInterval(async () => {
//           const updatedSubmission = await apiClient({ apiFunc: fetchBatchSubmissionStatus, args: [submission.id] });
//           if (updatedSubmission) {
//             setSubmissions(prev =>
//               prev.map(sub => sub.id === updatedSubmission.id ? updatedSubmission : sub)
//             );
//           }
//         }, 5000);
//         intervalIds.push(intervalId);
//       }
//     });

//     return () => {
//       intervalIds.forEach(id => clearInterval(id));
//     };
//   }, [submissions]);

//   if (loading) {
//     return <div>読み込み中...</div>
//   }

//   return (
//     <div className="batch-submission-history">
//       <h1>採点履歴</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>提出日時</th>
//             <th>課題</th>
//             <th>ユーザー</th>
//             <th>詳細</th>
//           </tr>
//         </thead>
//         <tbody>
//           {submissions.map(submission => (
//             <tr key={submission.id}>
//               <td>{new Date(submission.ts).toLocaleString('ja-JP')}</td>
//               <td>
//                 <a href={`https://www.coins.tsukuba.ac.jp/~amagasa/lecture/dsa-jikken/report${submission.lecture_id}/`} target="_blank" rel="noopener noreferrer">
//                   課題{submission.lecture_id}
//                 </a>
//               </td>
//               <td>
//                 {userDict[submission.user_id]?.username || ''}<br />
//                 {submission.user_id}
//               </td>
//               <td>
//                 {submission.complete_judge === submission.total_judge ? (
//                   <Link to={`/batch/result/${submission.id}`}>詳細</Link>
//                 ) : (
//                   `${submission.complete_judge}/${submission.total_judge}...`
//                 )}
//               </td>
//             </tr> 
//           ))}
//         </tbody>
//       </table>
//       <div className="pagination">
//         <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Prev</button>
//         <span>ページ {page}</span>
//         <button onClick={() => setPage(prev => prev + 1)} disabled={submissions.length < 10}>Next</button>
//       </div>
//     </div>
//   )
// }

// export default BatchStatus;
const BatchStatus: React.FC = () => {
    return <div>BatchStatus</div>
}
export default BatchStatus;
