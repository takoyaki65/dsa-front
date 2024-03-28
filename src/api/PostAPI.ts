import axios from 'axios';

const API_PREFIX = 'http://localhost:8000/api/v1/assignments';

// ファイルをアップロードする関数
export const uploadFile = async (file: File, id: number, sub_id: number): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await axios.post(`${API_PREFIX}/upload/${id}/${sub_id}`, formData, {
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

