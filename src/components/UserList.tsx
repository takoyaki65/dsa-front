import React, { useState } from 'react';
import { User } from '../types/user';

interface UserListProps {
    user_id: string;
    users: User[];
    selectedUsers: string[];
    setSelectedUsers: (selectedUsers: string[]) => void;
}



export const UserList: React.FC<UserListProps> = ({ user_id, users, selectedUsers, setSelectedUsers }) => {
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allUserIds = users.map(user => user.user_id).filter(id => id !== user_id);
            setSelectedUsers(allUserIds);
        } else {
        setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id: string) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== user_id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    return (
        <table style={{borderCollapse: 'collapse', border: '2px solid black'}}>
        <thead>
            <tr style={{backgroundColor: '#f2f2f2', borderBottom: '3px solid black'}}>
            <th style={{padding: '10px', borderRight: '1px solid black'}}><input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === users.length-1 && selectedUsers.length !== 0} /></th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>user_id</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>username</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>role</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>disabled</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>created_at</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>updated_at</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>active_start_date</th>
            <th style={{padding: '10px'}}>active_end_date</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user, index) => (
            <tr key={user.user_id} style={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9', borderBottom: '1px solid black'}}>
                <td style={{padding: '10px', borderRight: '1px solid black'}}><input type="checkbox" checked={selectedUsers.includes(user.user_id)} onChange={() => handleSelectUser(user.user_id)} disabled={user_id === user.user_id} /></td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.user_id}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.username}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.role}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.disabled ? 'Yes' : 'No'}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.created_at.toLocaleString()}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.updated_at.toLocaleString()}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.active_start_date.toLocaleString()}</td>
                <td style={{padding: '10px'}}>{user.active_end_date.toLocaleString()}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
};

export default UserList;
