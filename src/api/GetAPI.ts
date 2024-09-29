import axios from 'axios';
import { SubAssignmentDropdown, SubAssignmentDetail, Lecture, Problem } from '../types/Assignments';
import { User } from '../types/user';
import { Token } from '../types/token';
import { TextResponse } from '../types/response';

const API_PREFIX = 'http://localhost:8000/api/v1';

// "/api/v1/assignments/?open={true|false}"を通して、{公開期間内|公開期間外}の授業エントリを全て取得する関数
export const fetchLectures = async (open: boolean, token: string | null): Promise<Lecture[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/?open=${open}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('授業の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "/api/v1/public/assignments/{lecture_id}?evaluation={true|false}"を通して、{評価用|テスト用}の課題のリストを取得する関数
export const fetchProblems = async (lecture_id: number, evaluation: boolean, token: string | null): Promise<Problem[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/${lecture_id}?evaluation=${evaluation}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('課題の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "/api/v1/assignments/{lecture_id}/{assignment_id}/description?evaluation={true|false}"を通して、{評価用|テスト用}の課題の説明(Markdown)を取得する関数
export const fetchAssignmentDescription = async (lecture_id: number, assignment_id: number, evaluation: boolean, token: string | null): Promise<string> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<TextResponse>(`${API_PREFIX}/assignments/${lecture_id}/${assignment_id}/description?evaluation=${evaluation}`, { headers });
        return response.data.text;
    } catch (error: any) {
        const customError = new Error('課題の説明の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
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

export const updateToken = async (token: string | null): Promise<string> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get<Token>(`${API_PREFIX}/authorize/token/update`, {
            headers,
            withCredentials: true // クッキーを送信するために必要
        });
        return response.data.access_token;
    } catch (error) {
        console.error('トークンの更新に失敗しました', error);
        throw error;
    }
};