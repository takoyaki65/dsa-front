import axios from 'axios';
import { UserDelete } from '../types/user';
import { MessageResponse } from '../types/response';
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


// "/api/v1/assignments/problem/delete?lecture_id={lecture_id}?problem_id={problem_id}"を通じて、小課題の削除を行う
export const deleteProblem = async (lecture_id: number, problem_id: number, token: string | null): Promise<MessageResponse> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.delete(`${API_PREFIX}/assignments/problem/delete?lecture_id=${lecture_id}&problem_id=${problem_id}`, { headers });
        return response.data;
    } catch (error) {
        console.error('小課題の削除に失敗しました', error);
        throw new Error('小課題の削除に失敗しました');
    }
}


// "/api/v1/assignments/lecture/delete?lecture_id={lecture_id}"を通じて、課題エントリの削除を行う
export const deleteLecture = async (lecture_id: number, token: string | null): Promise<MessageResponse> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.delete(`${API_PREFIX}/assignments/lecture/delete?lecture_id=${lecture_id}`, { headers });
        return response.data;
    } catch (error) {
        console.error('課題エントリの削除に失敗しました', error);
        throw new Error('課題エントリの削除に失敗しました');
    }
}
