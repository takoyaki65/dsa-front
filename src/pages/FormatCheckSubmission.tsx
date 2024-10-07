import React, { useState, useEffect } from 'react';
import { fetchLectures, fetchProblems, fetchRequiredFiles } from '../api/GetAPI';
import { Lecture } from '../types/Assignments';
import FileUploadBox from '../components/FileUploadBox';
import { useParams } from 'react-router-dom';
import useApiClient from '../hooks/useApiClient';
import { useAuth } from '../context/AuthContext';
import { submitStudentZip } from '../api/PostAPI';
import { useNavigate } from 'react-router-dom';

const FormatCheckSubmission: React.FC = () => {
  const { token } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const lecture_id_from_query = searchParams.get('lecture_id');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(
    lecture_id_from_query ? parseInt(lecture_id_from_query) : null
  );
  const [requiredFiles, setRequiredFiles] = useState<string[]>([]);
  const { apiClient } = useApiClient();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lectureData = await apiClient({ apiFunc: fetchLectures, args: [true] });
        setLectures(lectureData);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const getRequiredFiles = async () => {
      if (selectedLectureId) {
        try {
          const problems = await apiClient({ apiFunc: fetchProblems, args: [selectedLectureId, false] });
          const allRequiredFiles = await Promise.all(
            problems.map(problem =>
              apiClient({ apiFunc: fetchRequiredFiles, args: [selectedLectureId, problem.assignment_id, false] })
            )
          );
          const uniqueFiles = Array.from(new Set(allRequiredFiles.flat()));
          // レポートのファイル名を追加
          setRequiredFiles(['report' + selectedLectureId + '.pdf', ...uniqueFiles]);
        } catch (error) {
          console.error('Error fetching required files:', error);
        }
      }
    };
    getRequiredFiles();
  }, [selectedLectureId, token]);

  const handleLectureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLectureId(event.target.value == "" ? null : parseInt(event.target.value));
  };

  const handleSubmit = async (files: File[]) => {
    // ファイルがclass{selectedLectureId}.zip一つのみであることをチェック
    if (files.length === 1 && files[0].name === 'class' + selectedLectureId + '.zip') {
      try {
        const response = await apiClient({ apiFunc: submitStudentZip, args: [selectedLectureId, false, files[0]] });
        console.log('Files uploaded successfully:', response);
        navigate('/status/me');
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    } else {
      alert('class{selectedLectureId}.zipのみアップロードできます');
    }
  }

  return (
    <div>
      <h1>フォーマットチェック</h1>
      <select onChange={handleLectureChange} value={selectedLectureId || ""}>
        <option value="">課題を選択してください</option>
        {lectures.map((lecture) => (
          <option key={lecture.id} value={lecture.id}>
            {lecture.title}
          </option>
        ))}
      </select>

      {selectedLectureId && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2>class{selectedLectureId}.zipの構造</h2>
          <pre style={{ textAlign: 'left' }}>
            {`class${selectedLectureId}/\n`}
            {`  +-${requiredFiles.join('\n  +-')}`}
          </pre>
        </div>
      )}

      {selectedLectureId &&
        <FileUploadBox 
          onSubmit={handleSubmit}
          descriptionOnBox={`class${selectedLectureId}.zipをアップロードしてください`}
        />
      }
    </div>
  )
};

export default FormatCheckSubmission;