import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Assignment } from '../types/Assignments';
import { fetchAssignments } from '../api/GetAPI';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';

const Sidebar: React.FC = () => {
	const { token, logout } = useAuth();
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const { apiClient } = useApiClient();
	
	useEffect(() => {
		const getAssignments = async () => {
			const assignmentsData = await apiClient(fetchAssignments);
			setAssignments(assignmentsData);
		};

		getAssignments();
	}, []);
	
	return (
		<SidebarContainer>
		<SidebarList>
			<Link to="/"><h3>ホーム</h3></Link>
			{assignments.map(assignment => (
			<SidebarItem key={assignment.id}>
				<Link to={`/submission/${assignment.id}`}>
				<h3>{assignment.title}</h3>
				</Link>
			</SidebarItem>
			))}
		</SidebarList>
		{token && <LogoutButton onClick={logout}>ログアウト</LogoutButton>}
		</SidebarContainer>
	);
}

export default Sidebar;

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