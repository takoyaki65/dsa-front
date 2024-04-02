import React, { useState } from 'react';
import { User } from '../types/user';

interface UserListProps {
    user_id: number;
    users: User[];
    selectedUsers: number[];
    setSelectedUsers: (selectedUsers: number[]) => void;
}



export const UserList: React.FC<UserListProps> = ({ user_id, users, selectedUsers, setSelectedUsers }) => {
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allUserIds = users.map(user => user.id).filter(id => id !== user_id);
            setSelectedUsers(allUserIds);
        } else {
        setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id: number) => {
        if (selectedUsers.includes(id)) {
        setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
        setSelectedUsers([...selectedUsers, id]);
        }
    };

    return (
        <table style={{borderCollapse: 'collapse', border: '2px solid black'}}>
        <thead>
            <tr style={{backgroundColor: '#f2f2f2', borderBottom: '3px solid black'}}>
            <th style={{padding: '10px', borderRight: '1px solid black'}}><input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === users.length-1 && selectedUsers.length !== 0} /></th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>id</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>username</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>is_admin</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>disabled</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>created_at</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>updated_at</th>
            <th style={{padding: '10px', borderRight: '1px solid black'}}>active_start_date</th>
            <th style={{padding: '10px'}}>active_end_date</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user, index) => (
            <tr key={user.id} style={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9', borderBottom: '1px solid black'}}>
                <td style={{padding: '10px', borderRight: '1px solid black'}}><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleSelectUser(user.id)} disabled={user_id === user.id} /></td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.id}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.username}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.is_admin ? 'Yes' : 'No'}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.disabled ? 'Yes' : 'No'}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.created_at}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.updated_at}</td>
                <td style={{padding: '10px', borderRight: '1px solid black'}}>{user.active_start_date}</td>
                <td style={{padding: '10px'}}>{user.active_end_date}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
};

export default UserList;
