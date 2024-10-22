import axios from 'axios';
import { Lecture, Problem, Submission, FileRecord, BatchSubmission, EvaluationStatus } from '../types/Assignments';
import { User } from '../types/user';
import { Token } from '../types/token';
import { TextResponse } from '../types/response'
import JSZip from 'jszip';

const API_PREFIX = 'http://localhost:8000/api/v1';

// "/api/v1/assignments/info?all={true|false}"を通して、{全て|公開期間内}の授業エントリを全て取得する関数
export const fetchLectures = async (all: boolean, token: string | null): Promise<Lecture[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Lecture[]>(`${API_PREFIX}/assignments/info?all=${all}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('授業の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "/api/v1/assignments/info/{lecture_id}"を通して、授業のエントリの詳細を取得する関数
export const fetchLectureEntry = async (lecture_id: number, token: string | null): Promise<Lecture> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Lecture>(`${API_PREFIX}/assignments/info/${lecture_id}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('授業のエントリの詳細の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "/api/v1/assignments/info/{lecture_id}/{assignment_id}/entry"を通して、課題のエントリの詳細を取得する関数。
// eval=Trueなら評価用の追加リソース(テストケースなど)も取得される
export const fetchProblemEntry = async (lecture_id: number, assignment_id: number, token: string | null): Promise<Problem> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Problem>(`${API_PREFIX}/assignments/info/${lecture_id}/${assignment_id}/entry`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('課題のエントリの詳細の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "/api/v1/assignments/info/{lecture_id}/{assignment_id}/detail?eval={true|false}"を通して、課題のエントリの詳細を取得する関数。
// eval=Trueなら評価用の追加リソース(テストケースなど)も取得される
export const fetchProblemDetail = async (lecture_id: number, assignment_id: number, evaluation: boolean, token: string | null): Promise<Problem> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Problem>(`${API_PREFIX}/assignments/info/${lecture_id}/${assignment_id}/detail?eval=${evaluation}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('課題のエントリの詳細の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "api/v1/assignments/status/submissions/id/{submission_id}"を通じて、指定された提出の進捗状況を取得する関数
export const fetchSubmissionStatus = async (submission_id: number, token: string | null): Promise<Submission> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Submission>(`${API_PREFIX}/assignments/status/submissions/id/${submission_id}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('提出の進捗状況の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};

// "/api/v1/assignments/status/submissions/view?page={page}?include_eval={true|false}?all={true|false}"を通じて、自分の提出の進捗状況を取得する関数
export const fetchSubmissionList = async (page: number, include_eval: boolean, all: boolean, token: string | null): Promise<Submission[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Submission[]>(`${API_PREFIX}/assignments/status/submissions/view?page=${page}&include_eval=${include_eval}&all=${all}`, { headers });
        return response.data;
    } catch (error: any) {
        const customError = new Error('自分の提出の進捗状況の取得に失敗しました');
        customError.stack = error.stack;
        (customError as any).originalError = error;
        throw customError;
    }
};


// "/api/v1/assignments/status/submissions/id/{submission_id}/files/zip?type={uploaded|arranged}"を通じて、ジャッジリクエストに関連するファイルのリストを取得する関数
export const fetchSubmissionFiles = async (submission_id: number, type: "uploaded" | "arranged", token: string | null): Promise<FileRecord[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/zip' } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/status/submissions/id/${submission_id}/files/zip?type=${type}`, { headers, responseType: 'arraybuffer' });

        //console.log("response.data", response.data);
        
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(response.data);

        //console.log("解凍したファイルの数", Object.keys(loadedZip.files).length);

        // ファイルの名前をconsole.logする
        Object.keys(loadedZip.files).forEach((fileName) => {
            //console.log("ファイルの名前", fileName);
        });

        const files: FileRecord[] = await Promise.all(
            Object.keys(loadedZip.files).map(async (fileName) => {
                let file = loadedZip.files[fileName];
                let content: string | Blob;
                if (fileName.endsWith(".txt") || fileName.endsWith(".json") || fileName.endsWith(".js") || fileName.endsWith(".ts") || fileName.endsWith(".html") || fileName.endsWith(".css") || fileName.endsWith(".md") || fileName.endsWith(".py") || fileName.endsWith(".java") || fileName.endsWith(".c") || fileName.endsWith(".cpp") || fileName.endsWith(".cs") || fileName.endsWith(".go") || fileName.endsWith(".rs") || fileName.endsWith(".rb") || fileName.endsWith(".php") || fileName.endsWith(".swift") || fileName.endsWith(".kt") || fileName.endsWith(".scala") || fileName.endsWith(".vb") || fileName.endsWith(".sql") || fileName.endsWith(".pl") || fileName.endsWith(".r") || fileName.endsWith(".html") || fileName.endsWith(".css") || fileName.endsWith(".js") || fileName.endsWith(".ts") || fileName.endsWith(".json") || fileName.endsWith(".md") || fileName.endsWith(".py") || fileName.endsWith(".java") || fileName.endsWith(".c") || fileName.endsWith(".cpp") || fileName.endsWith(".cs") || fileName.endsWith(".go") || fileName.endsWith(".rs") || fileName.endsWith(".rb") || fileName.endsWith(".php") || fileName.endsWith(".swift") || fileName.endsWith(".kt") || fileName.endsWith(".scala") || fileName.endsWith(".vb") || fileName.endsWith(".sql") || fileName.endsWith(".pl") || fileName.endsWith(".r")) {
                    content = await file.async('string');
                    //console.log("ファイルの名前[string]: ", fileName);
                } else if (fileName === "Makefile") {
                    content = await file.async('string');
                    //console.log("ファイルの名前[string]: ", fileName);
                } else {
                    content = await file.async('blob');
                    //console.log("ファイルの名前[blob]: ", fileName);
                }
                return { name: fileName, content };
            })
        );
        return files;
 
    } catch (error: any) {
        console.error("提出ファイルの取得に失敗しました", error);
        throw error;
    }
};


// "/api/v1/assignments/result/submissions/id/{submission_id}"を通じて、提出されたジャッジの結果の詳細を取得する関数
export const fetchSubmissionResultDetail = async (submission_id: number, token: string | null): Promise<Submission> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<Submission>(`${API_PREFIX}/assignments/result/submissions/id/${submission_id}`, { headers });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};


// "api/v1/assignments/status/batch/id/{batch_id}"を通じて、指定されたバッチ採点の結果を取得する関数
export const fetchBatchSubmissionStatus = async (batch_id: number, token: string | null): Promise<BatchSubmission> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<BatchSubmission>(`${API_PREFIX}/assignments/status/batch/id/${batch_id}`, { headers });
        return response.data;
    } catch (error: any) {
        console.error("指定されたバッチ採点の結果の取得に失敗しました", error);
        throw error;
    }
};


// "/api/v1/assignments/status/batch/all?page={page}"を通じて、バッチ採点の進捗状況のリストを取得する関数
export const fetchBatchSubmissionList = async (page: number, token: string | null): Promise<BatchSubmission[]> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<BatchSubmission[]>(`${API_PREFIX}/assignments/status/batch/all?page=${page}`, { headers });
        return response.data;
    } catch (error: any) {
        console.error("バッチ採点の結果のリストの取得に失敗しました", error);
        throw error;
    }
};


// "/api/v1/assignments/result/batch/id/{batch_id}"を通じて、指定されたバッチ採点の結果の詳細を取得する関数
export const fetchBatchSubmissionDetail = async (batch_id: number, token: string | null): Promise<BatchSubmission> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<BatchSubmission>(`${API_PREFIX}/assignments/result/batch/id/${batch_id}`, { headers });
        return response.data;
    } catch (error: any) {
        console.error("指定されたバッチ採点の結果の詳細の取得に失敗しました", error);
        throw error;
    }
};


// "/api/v1/assignments/result/batch/id/{batch_id}/user/{user_id}"を通じて、指定されたバッチ採点の結果の詳細を取得する関数
export const fetchEvaluationStatus = async (batch_id: number, user_id: string, token: string | null): Promise<EvaluationStatus> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<EvaluationStatus>(`${API_PREFIX}/assignments/result/batch/id/${batch_id}/user/${user_id}`, { headers });
        return response.data;
    } catch (error: any) {
        console.error("指定されたバッチ採点の結果の詳細の取得に失敗しました", error);
        throw error;
    }
};


// "/api/v1/assignments/result/batch/{batch_id}/files/uploaded/{user_id}"を通じて、特定のバッチ採点の特定の学生が提出したファイルを取得する関数
export const fetchBatchSubmissionUserUploadedFile = async (batch_id: number, user_id: string, token: string | null): Promise<FileRecord[]> => {
    try {
        // ZIPで受け取る
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/zip' } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/result/batch/${batch_id}/files/uploaded/${user_id}`, { headers, responseType: 'arraybuffer' });
        

        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(response.data);

        const files: FileRecord[] = await Promise.all(
            Object.keys(loadedZip.files).map(async (fileName) => {
                let file = loadedZip.files[fileName];
                let content: string | Blob;
                if (fileName.endsWith(".txt") || fileName.endsWith(".json") || fileName.endsWith(".js") || fileName.endsWith(".ts") || fileName.endsWith(".html") || fileName.endsWith(".css") || fileName.endsWith(".md") || fileName.endsWith(".py") || fileName.endsWith(".java") || fileName.endsWith(".c") || fileName.endsWith(".cpp") || fileName.endsWith(".cs") || fileName.endsWith(".go") || fileName.endsWith(".rs") || fileName.endsWith(".rb") || fileName.endsWith(".php") || fileName.endsWith(".swift") || fileName.endsWith(".kt") || fileName.endsWith(".scala") || fileName.endsWith(".vb") || fileName.endsWith(".sql") || fileName.endsWith(".pl") || fileName.endsWith(".r") || fileName.endsWith(".html") || fileName.endsWith(".css") || fileName.endsWith(".js") || fileName.endsWith(".ts") || fileName.endsWith(".json") || fileName.endsWith(".md") || fileName.endsWith(".py") || fileName.endsWith(".java") || fileName.endsWith(".c") || fileName.endsWith(".cpp") || fileName.endsWith(".cs") || fileName.endsWith(".go") || fileName.endsWith(".rs") || fileName.endsWith(".rb") || fileName.endsWith(".php") || fileName.endsWith(".swift") || fileName.endsWith(".kt") || fileName.endsWith(".scala") || fileName.endsWith(".vb") || fileName.endsWith(".sql") || fileName.endsWith(".pl") || fileName.endsWith(".r")) {
                    content = await file.async('string');
                    //console.log("ファイルの名前[string]: ", fileName);
                } else if (fileName === "Makefile") {
                    content = await file.async('string');
                    //console.log("ファイルの名前[string]: ", fileName);
                } else {
                    content = await file.async('blob');
                    //console.log("ファイルの名前[blob]: ", fileName);
                }
                return { name: fileName, content };
            })
        );

        return files;
    } catch (error: any) {
        console.error("特定のバッチ採点の特定の学生が提出したファイルの取得に失敗しました", error);
        throw error;
    }
};


// "/api/v1/assignments/result/batch/{batch_id}/files/report/{user_id}"を通じて、指定されたバッチ採点の特定の学生のレポートを取得する関数
export const fetchBatchSubmissionUserReport = async (batch_id: number, user_id: string, token: string | null): Promise<FileRecord> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/pdf' } : {};
        const response = await axios.get(`${API_PREFIX}/assignments/result/batch/${batch_id}/files/report/${user_id}`, { headers, responseType: 'arraybuffer' });
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        
        // Content-Dispositionヘッダーからファイル名を抽出
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'report.pdf';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
            if (fileNameMatch) {
                fileName = fileNameMatch[1];
            }
        }
        
        return {
            name: fileName,
            content: blob
        };
    } catch (error: any) {
        console.error("指定されたバッチ採点の特定の学生のレポートの取得に失敗しました", error);
        throw error;
    }
}



export const fetchUserList = async (user_id: string | null, token: string | null): Promise<User[]> => {
    try {
        let url = `${API_PREFIX}/users/all`;
        if (user_id !== null) {
            url += `?user_id=${user_id}&role=student`;
        }
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchUserInfo = async (user_id: string, token: string | null): Promise<User> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<User>(`${API_PREFIX}/users/info/${user_id}`, { headers });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};


export const fetchMyUserInfo = async (token: string | null): Promise<User> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, accept: 'application/json' } : {};
        const response = await axios.get<User>(`${API_PREFIX}/users/me`, { headers });
        return response.data;
    } catch (error: any) {
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