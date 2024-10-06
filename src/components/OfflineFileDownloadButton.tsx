import React from 'react';
import { FileRecord } from '../types/Assignments';


const OfflineFileDownloadButton: React.FC<{ file: FileRecord }> = ({ file }) => {
    if (typeof file.content === 'string') {
        console.log("file.content is string");
        return <div>error: file.content is string</div>;
    }
    const handleDownload = () => {
        const url = window.URL.createObjectURL(file.content as Blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <button onClick={handleDownload}>{file.name}</button>
    );
};

export default OfflineFileDownloadButton;
