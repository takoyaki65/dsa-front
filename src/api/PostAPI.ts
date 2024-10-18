import axios from 'axios';
import { LoginCredentials, CreateUser } from '../types/user';
import { Token, TokenResponse } from '../types/token';
import { Submission, BatchSubmission } from '../types/Assignments';

interface UploadResult {
    unique_id: string;
    filename: string;
    result: string;
}

const API_PREFIX = 'http://localhost:8000/api/v1';

// "/api/v1/assignments/judge/{lecture_id}/{assignment_id}/?eval={true|false}"を通して、課題のジャッジリクエストを送信する関数
// eval=Trueの場合は、採点リソースも使用して採点を行う
export const submitAssignment = async (lecture_id: number, assignment_id: number, evaluation: boolean, files: File[], token: string | null) : Promise<Submission> => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('file_list', file);
    });

    try {
        const headers = token ? {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        } : {};
        const response = await axios.post<Submission>(`${API_PREFIX}/assignments/judge/${lecture_id}/${assignment_id}?eval=${evaluation}`, formData, { headers });
        return response.data;
    } catch (error: any) {
        console.error('Error submitting assignment:', error);
        if (error.response) {
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            console.error('No response received from the server:', error.request);
        } else {
            console.error('Error during the request:', error.message);
        }
        throw error;
    }
}


// "/api/v1/assignments/judge/{lecture_id}?eval={true|false}"を通じて、学生のzip提出を受け付ける関数(学生はeval=falseの場合しか提出できない)
// eval=Trueの場合は、採点リソースも使用して採点を行う
export const submitStudentZip = async (lecture_id: number, evaluation: boolean, upload_zip_file: File, token: string | null): Promise<Submission[]> => {
    const formData = new FormData();
    formData.append('uploaded_zip_file', upload_zip_file);

    try {
        const headers = token ? {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        } : {};
        const response = await axios.post<Submission[]>(`${API_PREFIX}/assignments/judge/${lecture_id}?eval=${evaluation}`, formData, { headers });
        return response.data;
    } catch (error: any) {
        console.error('Error submitting student zip:', error);
        if (error.response) {
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            console.error('No response received from the server:', error.request);
        } else {
            console.error('Error during the request:', error.message);
        }
        throw error;
    }
}


// "/api/v1/assignments/batch/{lecture_id}?eval={true|false}"を通じて、バッチ採点をリクエストする関数
// eval=Trueの場合は、採点リソースも使用して採点を行う
export const submitBatchEvaluation = async (lecture_id: number, evaluation: boolean, uploaded_zip_file: File, token: string | null): Promise<BatchSubmission> => {
    const formData = new FormData();
    formData.append('uploaded_zip_file', uploaded_zip_file);

    try {
        const headers = token ? { Authorization: `Bearer ${token}` , accept: 'application/json', 'Content-Type': 'multipart/form-data'} : {};
        const response = await axios.post<BatchSubmission>(`${API_PREFIX}/assignments/batch/${lecture_id}?eval=${evaluation}`, formData, { headers });
        return response.data;
    } catch (error: any) {
        console.error('Error submitting batch evaluation:', error);
        if (error.response) {
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            console.error('No response received from the server:', error.request);
        } else {
            console.error('Error during the request:', error.message);
        }
        throw error;
    }
}





export const uploadStudentList = async (file: File, token: string | null): Promise<{ data: Blob, headers: any }> => {
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
        const response = await axios.post<TokenResponse>(`${API_PREFIX}/authorize/token/validate`, {}, { headers });
        return response.data.is_valid;
    } catch (error) {
        console.error('Token validation error:', error);
        throw error;
    }
};