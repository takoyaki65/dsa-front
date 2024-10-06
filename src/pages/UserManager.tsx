import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const UserManager: React.FC = () => {
	return (
		<Container>
			<Title>ユーザー管理</Title>
			<LinkContainer>
				<StyledLink to="/users/register">ユーザー追加</StyledLink>
				<StyledLink to="/users/delete">ユーザー削除</StyledLink>
			</LinkContainer>
		</Container>
	);
};

export default UserManager;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
`;

const Title = styled.h1`
	margin-bottom: 20px;
`;

const LinkContainer = styled.div`
	display: flex;
	gap: 20px;
`;

const StyledLink = styled(Link)`
	padding: 10px 20px;
	background-color: #007bff;
	color: white;
	text-decoration: none;
	border-radius: 5px;
	font-weight: bold;
	
	&:hover {
		background-color: #0056b3;
	}
`;
