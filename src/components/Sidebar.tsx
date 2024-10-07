import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Lecture, Problem } from '../types/Assignments';
import { fetchLectures, fetchProblems } from '../api/GetAPI';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';
import { UserRole } from '../types/token';

const Sidebar: React.FC = () => {
	const { token, user_id, role, logout } = useAuth();
	const [publicLectures, setPublicLectures] = useState<Lecture[]>([]);
	// どの授業の課題が展開されているかを管理する状態変数
	const [expandedPublicLectures, setExpandedPublicLectures] = useState<{ [key: number]: boolean }>({});

	// 授業ごとの課題を管理する状態変数
	const [trainingProblemsByLecture, setTrainingProblemsByLecture] = useState<{ [key: number]: Problem[] }>({});
	const { apiClient } = useApiClient();

	// 管理者用
	const [privateLectures, setPrivateLectures] = useState<Lecture[]>([]);
	const [expandedPrivateLectures, setExpandedPrivateLectures] = useState<{ [key: number]: boolean }>({});

	const [managerLectures, setManagerLectures] = useState<Lecture[]>([]);
	const [expandedManagerLectures, setExpandedManagerLectures] = useState<{ [key: number]: boolean }>({});

	const isAdminOrManager = role === UserRole.admin || role === UserRole.manager;

	useEffect(() => {
		// 公開されている授業エントリ(第1回課題、第2回課題、...)を取得
		const fetchPublicLectures = async () => {
			try {
				const lectures = await apiClient({apiFunc: fetchLectures, args: [true]});
				setPublicLectures(lectures);
			} catch (error) {
				console.error('Failed to fetch lectures:', error);
			}
		};

		// 管理者用の授業エントリを取得
		const fetchPrivateLectures = async () => {
			try {
				const lectures = await apiClient({apiFunc: fetchLectures, args: [false]});
				setPrivateLectures(lectures);
			} catch (error) {
				console.error('Failed to fetch lectures:', error);
			}
		};
		fetchPublicLectures();

		if (isAdminOrManager) {
			fetchPrivateLectures();
		};
	}, [token]);

	useEffect(() => {
		// 公開されている授業エントリ(第1回課題、第2回課題、...)に紐づく課題(課題1-1、課題1-2、...)を取得
		const fetchTrainProblemsForEachLecture = async () => {
			for (const lecture of publicLectures) {
				try {
					const problems = await apiClient({apiFunc: fetchProblems, args: [lecture.id, false]});
					setTrainingProblemsByLecture(prevProblemsByLecture => ({
						...prevProblemsByLecture,
						[lecture.id]: problems
					}));
				} catch (error) {
					console.error(`Failed to fetch problems for lecture ${lecture.id}:`, error);
				}
			}
		};

		// 管理者用の授業エントリに紐づく課題を取得
		const fetchManagerProblemsForEachLecture = async () => {
			for (const lecture of privateLectures) {
				try {
					const problems = await apiClient({apiFunc: fetchProblems, args: [lecture.id, false]});
					setTrainingProblemsByLecture(prevProblemsByLecture => ({
						...prevProblemsByLecture,
						[lecture.id]: problems
					}));
				} catch (error) {
					console.error(`Failed to fetch problems for lecture ${lecture.id}:`, error);
				}
			}
		};

		if (publicLectures.length > 0) {
			fetchTrainProblemsForEachLecture();
		};
		if (isAdminOrManager) {
			fetchManagerProblemsForEachLecture();
		};
	}, [publicLectures, privateLectures, token]);

	const toggleLecture = (lectureId: number) => {
		setExpandedPublicLectures(prev => (
			{ ...prev, [lectureId]: !prev[lectureId] }
		)
		);
	};

	const togglePrivateLecture = (lectureId: number) => {
		setExpandedPrivateLectures(prev => (
			{ ...prev, [lectureId]: !prev[lectureId] }
		)
		);
	};

	// TODO: Manager, Adminの場合は、公開していない課題や、評価用の課題も表示する
	return (
		<SidebarContainer>
			<SidebarList>
				<Link to="/status/me"><h3>{user_id}</h3></Link>
				<Link to="/"><h3>ホーム</h3></Link>
				{publicLectures.map(
					lecture => (
						<SidebarItem key={lecture.id}>
							<h3 onClick={() => toggleLecture(lecture.id)}>
								{expandedPublicLectures[lecture.id] ? '▼' : '▶'} {lecture.title}
							</h3>
							{expandedPublicLectures[lecture.id] && trainingProblemsByLecture[lecture.id] && (
								<ProblemList>
									{trainingProblemsByLecture[lecture.id].map(problem => (
										<ProblemItem key={problem.assignment_id}>
											<Link to={`/submission/${lecture.id}/${problem.assignment_id}`}>
												{problem.title}
											</Link>
										</ProblemItem>
									))}
									<ProblemItem>
										<Link to={`/format-check?lecture_id=${lecture.id}`}>フォーマットチェック</Link>
									</ProblemItem>
								</ProblemList>
							)}
						</SidebarItem>
					)
				)}

				{isAdminOrManager && <h3>非公開課題リスト↓</h3>}
				{isAdminOrManager &&
					privateLectures.map(
						lecture => (
							<SidebarItem key={lecture.id}>
								<h3 onClick={() => togglePrivateLecture(lecture.id)}>
									{expandedPrivateLectures[lecture.id] ? '▼' : '▶'} {lecture.title}
								</h3>
								{expandedPrivateLectures[lecture.id] && trainingProblemsByLecture[lecture.id] && (
									<ProblemList>
										{trainingProblemsByLecture[lecture.id].map(problem => (
											<ProblemItem key={problem.assignment_id}>
												<Link to={`/submission/${lecture.id}/${problem.assignment_id}`}>
													{problem.title}
												</Link>
											</ProblemItem>
										))}
									</ProblemList>
								)}
							</SidebarItem>
						)
					)
				}
			</SidebarList>
			
			{isAdminOrManager &&
				<div>
					<Link to="/batch/submit"><h3>採点</h3></Link>
					<Link to="/batch/status"><h3>採点履歴</h3></Link>
				</div>
			}
			{ role === UserRole.admin && <Link to="/users"><h3>ユーザー管理</h3></Link>}
			{token && <LogoutButton onClick={logout}>ログアウト</LogoutButton>}
		</SidebarContainer>
	);
}

export default Sidebar;


const ProblemList = styled.ul`
	list-style-type: none;
	padding-left: 20px;
`;

const ProblemItem = styled.li`
  margin: 5px 0;
	a {
		&:hover {
			text-decoration: underline;
		}
	}
`;


const SidebarContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 20px 20px 0 30px;
	width: 230px;
	height: 100vh;
	background-color: dimgray;
	position: fixed;
`;

const SidebarList = styled.ul`
	list-style-type: none;
	padding: 0;
`;

const SidebarItem = styled.li`
	h3 {
		margin: 10px 0;
		&:hover {
		background-color: #555;
		color: white;
		cursor: pointer;
		padding: 0px 20px 0 30px;
		margin: 0 -20px 0 -30px;
		}
	}
	a, a:visited {
		color: inherit;
		text-decoration: none;
	}
`;

const LogoutButton = styled.h4`
	margin: 0px 0px 50px 0px;
	background-color: transparent;
	color: inherit;
	border: none;
	text-align: left;
	width: 100%;
	cursor: pointer;

	&:hover {
		background-color: #555;
		color: white;
	}
`;