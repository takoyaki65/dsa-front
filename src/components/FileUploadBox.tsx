import React, { useState, useRef } from 'react';

interface FileUploadFormProps {
    onSubmit: (files: File[]) => void;
    requiredFiles: string[];
}

const FileUploadBox: React.FC<FileUploadFormProps> = ({ onSubmit, requiredFiles }) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files!)]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(files);
    }

    const handleAddFile = () => {
        fileInputRef.current?.click();
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="file" 
                onChange={handleFileChange} 
                multiple 
                style={{display: 'none'}}
                ref={fileInputRef}
            />
            <button type="button" onClick={handleAddFile}>+ファイル追加</button>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        {file.name}
                        <button type="button" onClick={() => handleRemoveFile(index)}>削除</button>
                    </li>
                ))}
            </ul>
            <button type="submit" disabled={files.length === 0}>提出</button>
        </form>
    );
};

export default FileUploadBox;
