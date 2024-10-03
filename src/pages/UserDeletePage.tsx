import React, { useState, useEffect } from 'react';
import { fetchUserList } from '../api/GetAPI';
import { User } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { deleteUsers } from '../api/DeleteAPI';
import { UserList } from '../components/UserList';
import { UserDelete } from '../types/user';
import useApiClient from '../hooks/useApiClient';
import { UserRole } from '../types/token';

const UserDeletePage: React.FC = () => {
    const { apiClient } = useApiClient();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [error, setError] = useState('');
    const { token, user_id, role } = useAuth(); // useAuthから現在のユーザー情報も取得する

    useEffect(() => {
        const getUsers = async () => {
            try {
                const userList = await apiClient({ apiFunc: fetchUserList });
                setUsers(userList);
            } catch (error) {
                console.error('ユーザーの取得に失敗しました。', error);
                setError('ユーザーの取得に失敗しました。');
            }
        };

        getUsers();
    }, [token, user_id]);

    const handleDelete = async () => {
        if (selectedUsers.length === 0) {
            alert('削除するユーザーを選択してください。');
            return;
        }
        
        try {
            await apiClient({ apiFunc: deleteUsers, args: [selectedUsers] });
            alert('選択されたユーザーが正常に削除されました。');
            const updatedUserList = await apiClient({ apiFunc: fetchUserList });
            setUsers(updatedUserList);
            setSelectedUsers([]);
        } catch (error) {
            console.error('ユーザーの削除に失敗しました。', error);
            setError(`ユーザーの削除に失敗しました: ${(error as any).response.data.detail}`);
        }
    };

    if (user_id === null) {
        return <p>ログインしていません。</p>;
    }
    if (role !== UserRole.admin) {
        return <p>管理者権限がありません。</p>;
    }

    return (
        <div>
            <h2>ユーザー削除</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <UserList user_id={user_id} users={users} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
            <button onClick={handleDelete} disabled={role !== UserRole.admin}>選択したユーザーを削除</button>
        </div>
    );
};

export default UserDeletePage;