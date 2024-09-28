import axios from 'axios';
import { SubAssignmentDropdown, SubAssignmentDetail, Lecture, Problem } from '../types/Assignments';
import { User } from '../types/user';

const API_PREFIX = 'http://localhost:8000/api/v1';

// "/api/v1/public"を通して、公開期間内の授業エントリを全て取得する関数
export const fetchPublicLectures = async (token: string | null): Promise<Lecture[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/public/`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// "/api/v1/public/{lecture_id}"を通して、授業の回に紐づく課題(公開期間内、フォーマットチェック用)を取得する関数
export const fetchPublicProblems = async (lecture_id: string, token: string | null): Promise<Problem[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/public/${lecture_id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// APIから課題データを取得する関数
export const fetchAssignments = async (token: string | null): Promise<Assignment[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/`, { headers });
        return response.data;
    } catch (error: any) { // error の型を any にすることで詳細情報を保持
        const customError = new Error('課題データの取得に失敗しました');
        customError.stack = error.stack; // 元のスタックトレースを保持
        (customError as any).originalError = error; // 元のエラーをプロパティとして保持
        throw customError;
    }
};


// APIから課題中の基本課題と発展課題を取得する関数
export const fetchSubAssignments = async (id: string, token: string | null): Promise<SubAssignmentDropdown[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/${id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// APIからドロップダウンで選択された課題の詳細情報を取得する関数
export const fetchSubAssignmentDetail = async (id: string, sub_id: string, token: string | null): Promise<SubAssignmentDetail | null> => {
    try {
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
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateToken = async (token: string | null): Promise<string | null> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_PREFIX}/authorize/token/update`, { headers,
            withCredentials: true // クッキーを送信するために必要
        });
        if (response.data.is_valid && response.data.access_token) {
            return response.data.access_token;
        }
    } catch (error) {
        console.error('トークンの更新に失敗しました', error);
    }
    return null;
};