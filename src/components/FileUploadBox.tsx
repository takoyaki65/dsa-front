import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTrash } from 'react-icons/fa';
import './FileUploadBox.css';

interface FileUploadFormProps {
    onSubmit: (files: File[]) => void;
    descriptionOnBox: string;
}

const FileUploadBox: React.FC<FileUploadFormProps> = ({ onSubmit, descriptionOnBox }) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        <div className="file-upload-box">
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} ref={fileInputRef} />
                <p>{descriptionOnBox}</p>
                {files.length > 0 && (
                    <ul className='file-list'>
                        {files.map((file, index) => (
                            <li key={index}>
                                {file.name}
                                <button onClick={() => handleRemoveFile(index)} className='remove-file'>
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="button-container">
                <button type="button" onClick={handleAddFile} className="add-file">ファイルを追加</button>
                <button type="submit" onClick={handleSubmit} disabled={files.length === 0} className="submit">提出</button>
            </div>
        </div>
    );
};

export default FileUploadBox;
