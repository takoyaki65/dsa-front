import { ProgressMessage } from '../types/Assignments';

const API_WS_PREFIX = 'ws://localhost:8000/api/v1';

interface WebSocketCallbacks {
    onProgress: (progress: ProgressMessage) => void;
}

export const startProcessingWithProgress = (
    id: number,
    sub_id: number,
    filename: string,
    { onProgress }: WebSocketCallbacks
) => {
    const ws = new WebSocket(`${API_WS_PREFIX}/assignments/ws/${id}/${sub_id}`);

    ws.onopen = () => {
        // WebSocket接続が開かれたら、filenameを送信
        ws.send(JSON.stringify({ filename }));
    };

    ws.onmessage = (event) => {
        try {
        const data = JSON.parse(event.data);
        switch (data.status) {
            case 'progress':
                onProgress(data);
                break;
            case 'done':
                onProgress(data);
                break;
            case 'error':
                onProgress(data);
                break;
            default:
            console.error('Unknown message type:', data);
        }
        } catch (error) {
            console.error('Error parsing message:', error);
            onProgress({ status: 'error', message: 'メッセージの解析に失敗しました。', progress_percentage: -1 });
        }
    };

    ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        onProgress({ status: 'error', message: 'WebSocketエラーが発生しました。', progress_percentage: -1 });
    };

    ws.onclose = (event) => {
        if (event.wasClean) {
            // console.log('WebSocket closed cleanly');
        } else {
            console.error('WebSocket closed with error:', event);
            onProgress({ status: 'error', message: 'WebSocketが予期せず閉じました。', progress_percentage: -1 });
        }
    };

    // WebSocket接続を閉じる関数を返す
    return () => {
        ws.close();
    };
};