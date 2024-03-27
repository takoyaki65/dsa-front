import axios from 'axios';
import { Assignment, SubAssignmentDropdown, SubAssignmentDetail } from '../types/Assignments';

const API_PREFIX = 'http://localhost:8000/api/v1/assignments';
// APIから課題データを取得する関数
export const fetchAssignments = async (): Promise<Assignment[]> => {
    try {
        const response = await axios.get(`${API_PREFIX}/`);
        return response.data;
    } catch (error) {
        throw new Error('課題データの取得に失敗しました');
    }
};

// APIから課題中の基本課題と発展課題を取得する関数
export const fetchSubAssignments = async (id: string): Promise<SubAssignmentDropdown[]> => {
    try {
        const response = await axios.get(`${API_PREFIX}/${id}`);
        return response.data;
    } catch (error) {
        console.error('課題データの取得に失敗しました', error);
        throw error;
    }
};

// APIからドロップダウンで選択された課題の詳細情報を取得する関数
export const fetchSubAssignmentDetail = async (id: string, sub_id: string): Promise<SubAssignmentDetail | null> => {
    try {
        const response = await axios.get(`${API_PREFIX}/${id}/${sub_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
