import React, { useState, useRef } from 'react';
import { uploadFile } from '../api/PostAPI';

interface FileUploadProps {
    id: number;
    sub_id: number;
    fileName: string;
    fileNum?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, sub_id, fileName, fileNum }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
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
    };

    const processFile = (files: FileList | null) => {
        if (files && files[0]) {
            const selectedFile = files[0];
            setFile(selectedFile); // Always set the file
            if (selectedFile.name !== fileName) {
                setError(`ファイル名が違います．${fileName}を提出してください．`);
                // Do not return here to keep the file selected even if the name is different
            } else {
                setError(null); // Clear error if file name matches
            }
        }
    };

    const handleCancel = () => {
        setFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (file && !error) { // Only attempt to upload if there's a file and no error
            try {
                const filename = await uploadFile(file, id, sub_id);
                console.log(`File uploaded: ${filename}`);
                setError(null);
            } catch (error) {
                console.error('Error uploading file');
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
                <p style={{ color: 'red', minHeight: '20px' }}>{error ? error : ''}</p>
                <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: 'auto', padding: '10px', margin: '10px 0' }}>ファイルを選択</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={handleCancel} disabled={!file} style={{ width: 'auto', padding: '10px' }}>選択取り消し</button>
                <button type="button" onClick={handleSubmit} disabled={!file || error !== null} style={{ width: 'auto', padding: '10px' }}>アップロード</button>
            </div>
        </>
    );
};

export default FileUpload;