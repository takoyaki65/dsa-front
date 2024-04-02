import axios from 'axios';
import { Assignment, SubAssignmentDropdown, SubAssignmentDetail } from '../types/Assignments';
import { User } from '../types/user';

const API_PREFIX = 'http://localhost:8000/api/v1';
// APIから課題データを取得する関数
export const fetchAssignments = async (token: string | null): Promise<Assignment[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/`, { headers });
        return response.data;
    } catch (error) {
        throw new Error('課題データの取得に失敗しました');
    }
};

// APIから課題中の基本課題と発展課題を取得する関数
export const fetchSubAssignments = async (id: string, token: string | null): Promise<SubAssignmentDropdown[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error('課題データの取得に失敗しました', error);
        throw error;
    }
};

// APIからドロップダウンで選択された課題の詳細情報を取得する関数
export const fetchSubAssignmentDetail = async (id: string, sub_id: string, token: string | null): Promise<SubAssignmentDetail | null> => {
    try {
        console.log(`token: ${token}`)
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/${id}/${sub_id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserList = async (token: string | null): Promise<User[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_PREFIX}/users/all`, { headers });
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};
