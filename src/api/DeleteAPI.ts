import axios from 'axios';
import { UserDelete } from '../types/user';
const API_PREFIX = 'http://localhost:8000/api/v1';

// ユーザーを削除するAPI関数
export const deleteUsers = async (user_ids: string[], token: string | null): Promise<void> => {
    try {
        //console.log('Sending data:', { user_ids: user_ids });
        const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
        await axios.post(`${API_PREFIX}/users/delete`, { user_ids: user_ids }, { headers });
    } catch (error) {
        console.error('ユーザーの削除に失敗しました', error);
        throw new Error('ユーザーの削除に失敗しました');
    }
};
