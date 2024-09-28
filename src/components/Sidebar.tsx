import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Lecture, Problem } from '../types/Assignments';
import { fetchPublicLectures, fetchPublicProblems } from '../api/GetAPI';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';

const Sidebar: React.FC = () => {
	const { token, logout } = useAuth();
	const [publicLectures, setPublicLectures] = useState<Lecture[]>([]);
	// どの授業の課題が展開されているかを管理する状態変数
	const [expandedLectures, setExpandedLectures] = useState<{ [key: number]: boolean }>({});
	// 授業ごとの課題を管理する状態変数
	const [problemsByLecture, setProblemsByLecture] = useState<{ [key: number]: Problem[] }>({});
	const { apiClient } = useApiClient();

	useEffect(() => {
		// 公開されている授業エントリ(第1回課題、第2回課題、...)を取得
		const fetchLectures = async () => {
			try {
				const lectures = await apiClient(fetchPublicLectures);
				setPublicLectures(lectures);
			} catch (error) {
				console.error('Failed to fetch lectures:', error);
			}
		};

		// 公開されている授業エントリ(第1回課題、第2回課題、...)に紐づく課題(課題1-1、課題1-2、...)を取得
		const fetchProblemsForEachLecture = async () => {
			for (const lecture of publicLectures) {
				try {
					const problems = await apiClient(fetchPublicProblems, lecture.id, token);
					setProblemsByLecture(prevProblemsByLecture => ({
						...prevProblemsByLecture,
						[lecture.id]: problems
					}));
				} catch (error) {
					console.error(`Failed to fetch problems for lecture ${lecture.id}:`, error);
				}
			}
		};

		fetchLectures();
		fetchProblemsForEachLecture();
	}, [apiClient]);

	const toggleLecture = (lectureId: number) => {
		setExpandedLectures(prev => (
			{ ...prev, [lectureId]: !prev[lectureId] }
		)
		);
	};

	return (
		<SidebarContainer>
			<SidebarList>
				<Link to="/"><h3>ホーム</h3></Link>
				{publicLectures.map(
					lecture => (
						<SidebarItem key={lecture.id}>
							<h3 onClick={() => toggleLecture(lecture.id)}>
								{expandedLectures[lecture.id] ? '▼' : '▶'} {lecture.title}
							</h3>
							{expandedLectures[lecture.id] && problemsByLecture[lecture.id] && (
								<ProblemList>
									{problemsByLecture[lecture.id].map(problem => (
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
				)}
			</SidebarList>
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