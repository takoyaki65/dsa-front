import axios from 'axios';
import { LoginCredentials, CreateUser } from '../types/user';
import { Token } from '../types/token';

const API_PREFIX = 'http://localhost:8000/api/v1';

// ファイルをアップロードする関数
export const uploadFile = async (file: File, id: number, sub_id: number): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await axios.post(`${API_PREFIX}/assignments/upload/${id}/${sub_id}`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        console.log('File uploaded successfully', response.data);
        return response.data.result; // または適切なレスポンスを返します。
    } catch (error) {
        console.error('Error uploading file', error);
        throw error; // エラーを呼び出し元に伝播させる
    }
};

// 
export const createUser = async (user: CreateUser, token: string | null): Promise<string> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.post(`${API_PREFIX}/users/register`, user, { headers });
        console.log('User created successfully', response.data);
        return response.data.result;
    } catch (error) {
        console.error('Error creating user', error);
        throw error;
    }
}

// ログイン関数
export const login = async (credentials: LoginCredentials): Promise<Token> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
        const response = await axios.post<Token>(`${API_PREFIX}/authorize/token`, formData);
        return response.data; 
    } catch (error) {
        console.error('Error logging in', error);
        throw error;
    }
}

export const logout = async (token: string): Promise<void> => {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post(`${API_PREFIX}/authorize/logout`, {}, { headers });
    } catch (error) {
        console.error('Error logging out', error);
        throw error;
    }
}