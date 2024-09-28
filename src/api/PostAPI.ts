import axios from 'axios';
import { LoginCredentials, CreateUser } from '../types/user';
import { Token } from '../types/token';
import { ProgressMessage } from '../types/Assignments';

interface UploadResult {
    unique_id: string;
    filename: string;
    result: string;
}

const API_PREFIX = 'http://localhost:8000/api/v1';
// ファイルをアップロードする関数(多分uploadFileWithProgressに切り替える)
export const uploadFile = async (file: File, id: number, sub_id: number): Promise<UploadResult> =>{
    const formData = new FormData();
    formData.append("upload_file", file);
    try {
        const response = await axios.post(`${API_PREFIX}/assignments/upload/${id}/${sub_id}`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        const data: UploadResult = response.data;
        return data; // uuidが付加されたファイル名を返す
    } catch (error) {
        throw error; // エラーを呼び出し元に伝播させる
    }
};

export const uploadStudentList = async (file: File, token: string): Promise<{ data: Blob, headers: any }> => {
    const formData = new FormData();
    formData.append("upload_file", file);

    try {
        const response = await axios.post(`${API_PREFIX}/users/register/multiple`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            responseType: 'blob' // ファイルを受け取るために blob を指定
        });

        return { data: response.data, headers: response.headers }; // Blobデータをそのまま返す
    } catch (error: any) {
        if (error.response) {
            console.error("Server responded with an error:", error.response.data);
        } else if (error.request) {
            console.error("No response received from the server:", error.request);
        } else {
            console.error("Error during the request:", error.message);
        }
        throw error;
    }
};
// 
export const createUser = async (user: CreateUser, token: string | null): Promise<string> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.post(`${API_PREFIX}/users/register`, user, { headers });
        return response.data.result;
    } catch (error) {
        throw error;
    }
}

// ログイン関数
export const login = async (credentials: LoginCredentials): Promise<Token> => {
    const formData = new FormData();
    formData.append('username', credentials.user_id);
    formData.append('password', credentials.password);

    try {
        const response = await axios.post<Token>(`${API_PREFIX}/authorize/token`, formData, {
            withCredentials: true // クッキーを送信するために必要
        });
        return response.data; 
    } catch (error) {
        throw error;
    }
}

export const logout = async (token: string): Promise<void> => {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post(`${API_PREFIX}/authorize/logout`, {}, { headers,
            withCredentials: true // クッキーを送信するために必要
        });
    } catch (error) {
        throw error;
    }
}

export const validateToken = async (token: string): Promise<boolean> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.post(`${API_PREFIX}/authorize/token/validate`, {}, { headers });
        return response.data.is_valid;
    } catch (error) {
        console.error('Token validation error:', error);
        throw error;
    }
};