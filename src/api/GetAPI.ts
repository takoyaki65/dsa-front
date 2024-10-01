import axios from 'axios';
import { SubAssignmentDropdown, SubAssignmentDetail, Lecture, Problem, SubmissionRecord, JudgeProgressAndStatus, FileRecord } from '../types/Assignments';
import { User } from '../types/user';
import { Token } from '../types/token';
import { TextResponse } from '../types/response';

const API_PREFIX = 'http://localhost:8000/api/v1';

// "/api/v1/assignments/?open={true|false}"を通して、{公開期間内|公開期間外}の授業エントリを全て取得する関数
export const fetchLectures = async (open: boolean, token: string | null): Promise<Lecture[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Lecture[]>(`${API_PREFIX}/assignments/?open=${open}`, { headers });
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
        const response = await axios.get<Problem[]>(`${API_PREFIX}/assignments/${lecture_id}?evaluation=${evaluation}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('課題の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "/api/v1/assignments/{lecture_id}/{assignment_id}?evaluation={true|false}"を通して、{評価用|テスト用}の課題のエントリを取得する関数
export const fetchProblemEntry = async (lecture_id: number, assignment_id: number, evaluation: boolean, token: string | null): Promise<Problem> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Problem>(`${API_PREFIX}/assignments/${lecture_id}/${assignment_id}?evaluation=${evaluation}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('課題のエントリの取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
}


// "/api/v1/assignments/{lecture_id}/{assignment_id}/detail?evaluation={true|false}"を通して、{評価用|テスト用}の課題のエントリの詳細を取得する関数
export const fetchProblemDetail = async (lecture_id: number, assignment_id: number, evaluation: boolean, token: string | null): Promise<Problem> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Problem>(`${API_PREFIX}/assignments/${lecture_id}/${assignment_id}/detail?evaluation=${evaluation}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('課題のエントリの詳細の取得に失敗しました');
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


// "/api/v1/assignments/{lecture_id}/{assignment_id}/required-files?evaluation={true|false}"を通して、{評価用|テスト用}の課題の必要ファイルのリストを取得する関数
export const fetchRequiredFiles = async (lecture_id: number, assignment_id: number, evaluation: boolean, token: string | null): Promise<string[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<string[]>(`${API_PREFIX}/assignments/${lecture_id}/${assignment_id}/required-files?evaluation=${evaluation}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('必要ファイルの取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "api/v1/assignments/submissions/{submission_id}"を通じて、指定された提出の進捗状況を取得する関数
export const fetchSubmissionStatus = async (submission_id: number, token: string | null): Promise<JudgeProgressAndStatus> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<JudgeProgressAndStatus>(`${API_PREFIX}/assignments/submissions/${submission_id}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('提出の進捗状況の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};

// "/api/v1/assignments/submissions/me?page={page}"を通じて、自分の提出の進捗状況を取得する関数
export const fetchMySubmissionList = async (page: number, token: string | null): Promise<JudgeProgressAndStatus[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<JudgeProgressAndStatus[]>(`${API_PREFIX}/assignments/submissions/me?page=${page}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('自分の提出の進捗状況の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "/api/v1/assignments/submissions/{submission_id}/files"を通じて、ジャッジリクエストに関連するファイルのリストを取得する関数
export const fetchSubmissionFiles = async (submission_id: number, token: string | null): Promise<FileRecord[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<FileRecord[]>(`${API_PREFIX}/assignments/submissions/${submission_id}/files`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('提出ファイルの取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
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