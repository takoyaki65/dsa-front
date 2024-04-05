import React, { useState, useRef } from 'react';
import { uploadFile } from '../api/PostAPI';
import { startProcessingWithProgress } from '../api/WebSocketAPI';
import { ProgressMessage } from '../types/Assignments';
interface FileUploadProps {
    id: number;
    sub_id: number;
    fileName: string;
    onProgressUpdate: (progress: ProgressMessage | null) => void; // 進行状況を親コンポーネントに通知するためのコールバック
    isProcessing?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, sub_id, fileName, onProgressUpdate, isProcessing }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isNameCorrect, setIsNameCorrect] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsNameCorrect(null);
        const files = event.target.files;
        processFile(files);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        processFile(files);
        setError(null);
    };

    const processFile = (files: FileList | null) => {
        if (files && files[0]) {
            const selectedFile = files[0];
            setFile(selectedFile); // Always set the file
            if (selectedFile.name !== fileName) {
                setIsNameCorrect(false);
                // Do not return here to keep the file selected even if the name is different
            } else {
                setIsNameCorrect(true); // Clear error if file name matches
            }
        }
    };

    const handleCancel = () => {
        setFile(null);
        setIsNameCorrect(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (file && isNameCorrect) {
            try {
                const filename = await uploadFile(file, id, sub_id);
                // WebSocket 通信を開始し、進行状況を受信
                startProcessingWithProgress(
                    id,
                    sub_id,
                    filename,
                    {
                        onProgress: (progress) => {
                            onProgressUpdate(progress); // 進行状況を親コンポーネントに通知
                        }
                    }
                );
            } catch (error) {
                console.error('Error uploading file', error);
                setError('Failed to upload the file.');
            }
        }
    };

    return (
        <>
            <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', border: '1px solid #ddd', textAlign: 'center', minHeight: '150px' }}
                onDragOver={handleDragOver} onDrop={handleDrop}>
                <p>{file ? file.name : 'ファイルを選択してください'}</p>
                {/* Always reserve space for error message */}
                <p style={{ color: 'red', minHeight: '20px' }}>{isNameCorrect !== null && !isNameCorrect ? `ファイル名が違います．${fileName}を提出してください．` : ''}</p>
                <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                <button disabled={isProcessing} type="button" onClick={() => fileInputRef.current?.click()} style={{ width: 'auto', padding: '10px', margin: '10px 0' }}>ファイルを選択</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={handleCancel} disabled={!file} style={{ width: 'auto', padding: '10px' }}>選択取り消し</button>
                <button type="button" onClick={handleSubmit} disabled={!file || !isNameCorrect || isProcessing} style={{ width: 'auto', padding: '10px' }}>アップロード</button>
            </div>
        </>
    );
};

export default FileUpload;