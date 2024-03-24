import { Assignment, SubAssignmentDropdown, SubAssignmentDetail } from '../types/Assignments';

// APIから課題データを取得する関数
export const fetchAssignments = async (): Promise<Assignment[]> => {
    try {
        const response = await fetch('http://localhost:8000/sidebar', { mode: 'cors' });
        const data = await response.json();
        console.log(data);
        return JSON.parse(data);
    } catch (error) {
        console.error('課題データの取得に失敗しました', error);
        return [];
    }
};

// APIから課題中の基本課題と発展課題を取得する関数
export const fetchSubAssignments = async (id: string): Promise<SubAssignmentDropdown[]> => {
    try {
        const response = await fetch(`http://localhost:8000/assignments/${id}`, { mode: 'cors' });
        const data = await response.json();
        console.log(data);
        return JSON.parse(data);
    } catch (error) {
        console.error('課題データの取得に失敗しました', error);
        return [];
    }
};

// APIからドロップダウンで選択された課題の詳細情報を取得する関数
export const fetchSubAssignmentDetail = async (id: string, sub_id: string): Promise<SubAssignmentDetail | null> => {
    try {
        const response = await fetch(`http://localhost:8000/assignments/${id}/${sub_id}`, { mode: 'cors' });
        const data = await response.json();
        console.log(data);
        return JSON.parse(data);
    } catch (error) {
        console.error('課題データの取得に失敗しました', error);
        return null;
    }
};
