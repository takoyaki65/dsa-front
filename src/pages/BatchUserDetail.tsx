import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBatchSubmissionUserUploadedFile, fetchEvaluationStatus, fetchProblemDetail } from '../api/GetAPI';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';
import { Problem, EvaluationStatus, Lecture, TestCases } from '../types/Assignments';
import styled from 'styled-components';
import JudgeResultsViewer from '../components/JudgeResultsViewer';
import { FileRecord } from '../types/Assignments';
import CodeBlock from '../components/CodeBlock';
import OfflineFileDownloadButton from '../components/OfflineFileDownloadButton';
import LoadingComponent from '../components/LoadingComponent';
import StatusButton from '../components/StatusButtonComponent';

type ColumnDefinition = {
    key: string;
    label: string;
};

const baseColumns: ColumnDefinition[] = [
  { key: "status", label: "ステータス" },
  { key: "report", label: "レポート" },
];

const BatchUserDetail: React.FC<{ openingData: string }> = ({ openingData = "ステータス" }) => {
  const { batchId, userId } = useParams<{ batchId: string; userId: string }>();
  const { token } = useAuth();
  const { apiClient } = useApiClient();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [evaluationStatus, setEvaluationStatus] = useState<EvaluationStatus | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [testCaseId2TestCase, setTestCaseId2TestCase] = useState<Map<number, TestCases>>(new Map());
  const [columns, setColumns] = useState<ColumnDefinition[]>(baseColumns);
  const [showingData, setShowingData] = useState<string>(openingData);

  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
  const [selectedUploadedFile, setSelectedUploadedFile] = useState<string>('');


  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (!batchId || !userId) return;
      try {
        // 特定のバッチ採点の特定の学生の詳細を取得
        const evaluationStatus = await apiClient({ apiFunc: fetchEvaluationStatus, args: [parseInt(batchId), parseInt(userId)] });
        setEvaluationStatus(evaluationStatus);

        let problemsData: Problem[] = [];
        // 課題情報を取得
        for (const problem of evaluationStatus.lecture.problems){
          const problemDetail = await apiClient({ apiFunc: fetchProblemDetail, args: [problem.lecture_id, problem.assignment_id, true] });
          problemsData.push(problemDetail);
        }
        setProblems(problemsData);
        setColumns(baseColumns.concat(problemsData.map(problem => ({ key: problem.assignment_id.toString(), label: problem.title }))))

        
        if (evaluationStatus.upload_file_exists) {
          // アップロードされたファイルを取得
          const file_list = await apiClient({ apiFunc: fetchBatchSubmissionUserUploadedFile, args: [parseInt(batchId), parseInt(userId)] });
          setUploadedFiles(file_list);
        }

        // テストケースを取得
        const testCaseId2TestCase = new Map<number, TestCases>();
        for (const problem of problemsData) {
          for (const test_case of problem.detail?.test_cases ?? []) {
            testCaseId2TestCase.set(test_case.id, test_case);
          }
        }
        setTestCaseId2TestCase(testCaseId2TestCase);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        if (problems.length > 0 && evaluationStatus?.submissions.length! > 0) {
          setSelectedId(0);
        }
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, batchId, userId]);

  if (isLoading) {
    return <LoadingComponent message="読み込み中..." />;
  }

  const handleCheckListRowClick = (index: number) => {
    setSelectedId(index);
  }

  const getSubmissionStatus = (status: "submitted" | "delay" | "non-submitted" | null) => {
    switch (status) {
      case "submitted":
        return '提出済み';
      case "delay":
        return '遅延';
      case "non-submitted":
        return '未提出';
      default:
        return '不明';
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleUploadedFileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUploadedFile(event.target.value);
  };

  const getSelectedUploadedFileContent = () => {
    const file = uploadedFiles.find((file) => file.name === selectedUploadedFile);
    return file?.content as string;
  };

  const handleColumnClick = (columnKey: string, index: number) => {
    const column = columns.find(col => col.key === columnKey);
    if (column && column.label !== showingData) {
      setShowingData(column.label);
      setSelectedId(index);
      }
  };

  const getStatusForColumn = (column: ColumnDefinition, evaluationStatus: EvaluationStatus | null) => {
    if (!evaluationStatus) return "non-submitted";
  
    if (column.key === "status") {
      return evaluationStatus.status || "non-submitted";
    }
  
    if (column.key === "report") {
      if (!evaluationStatus.report_exists) {
        return "未提出";
      }
      return evaluationStatus.status === "submitted" ? "提出" : "遅延";
    }
  
    const submission = evaluationStatus.submissions.find(
      sub => sub.assignment_id.toString() === column.key
    );
    return submission?.result || "non-submitted";
  };
  
  console.log(`selectedId: ${selectedId}`);
  console.log(`evaluationStatus?.submissions: ${JSON.stringify(evaluationStatus?.submissions)}`);
  return (
    <div>
      <h1>採点履歴</h1>
      <h2 style={{margin: '5px 0 5px'}}>
        <LinkButton href={`/batch/result/${batchId}`}>
          {evaluationStatus?.lecture.title} (Batch ID: {batchId})
        </LinkButton>
        &nbsp;&gt;&nbsp; {evaluationStatus?.username} &nbsp;&gt;&nbsp; {showingData}
      </h2>
      <div style={{ fontSize: '14px', color: '#808080' }}>提出: {evaluationStatus?.submit_date instanceof Date ? evaluationStatus?.submit_date.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-') : new Date(evaluationStatus?.submit_date!).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-')}</div>
      <Divider style={{ height: '3px', marginBottom: '20px', borderRadius: '2px' }} />
      <div>
        <HeaderContainer>
          {columns.map((column, index) => (
            <HeaderColumnContainer 
              key={column.key}
              onClick={() => handleColumnClick(column.key, index)}
              isActive={column.label === showingData}
            >
              <HeaderItem>
                {column.label}
              </HeaderItem>
            </HeaderColumnContainer>
          ))}
        </HeaderContainer>
        <ResultContainer>
          {columns.map((column, index) => (
            <ColumnContainer 
              key={column.key}
            >
              <ResultItem>
                <StatusButton status={getStatusForColumn(column, evaluationStatus)} isButton={true} onClick={() => handleColumnClick(column.key, index)}/>
              </ResultItem>
            </ColumnContainer>
          ))}
        </ResultContainer>
      </div>
      <h2>提出ファイル</h2>
      <h3>レポート</h3>
      <ul>
        {uploadedFiles.filter(file => file.content instanceof Blob).map(file => (
          <li key={file.name}>
            <OfflineFileDownloadButton file={file} />
          </li>
        ))}
      </ul>
      <h3>プログラム</h3>
      <Dropdown onChange={handleUploadedFileSelect} value={selectedUploadedFile}>
        <option value="">ファイルを選択</option>
        {uploadedFiles.filter(file => typeof file.content === 'string').map(file => (
          <option key={file.name} value={file.name}>{file.name}</option>
        ))}
      </Dropdown>
      {selectedUploadedFile && (
        <CodeBlock code={getSelectedUploadedFileContent()} fileName={selectedUploadedFile} />
      )}
      <ResultTable>
        <ResultHeader>
            <ResultHeaderCell key={"term"} align="term">{"項目"}</ResultHeaderCell>
            <ResultHeaderCell key={"result"} align="result">{"結果"}</ResultHeaderCell>
        </ResultHeader>
        {selectedId !== null && selectedId > 1 && evaluationStatus?.submissions[selectedId-2].judge_results.map(judge_result => (
          <React.Fragment key={judge_result.id}>
            <ResultRow 
              isExpanded={expandedRows.has(judge_result.id)}
              onClick={() => toggleExpand(judge_result.id)}
            >
              <ResultCell>
                {testCaseId2TestCase.get(judge_result.testcase_id)?.description || ''}
              </ResultCell>
              <ResultCell>
                {judge_result.result}
              </ResultCell>
              <ExpandIcon isExpanded={expandedRows.has(judge_result.id)} />
            </ResultRow>
            {expandedRows.has(judge_result.id) && (
              <ExpandedContent>
                <JudgeResultsViewer 
                  result={judge_result} 
                  testCase={testCaseId2TestCase.get(judge_result.testcase_id)!} 
                />
              </ExpandedContent>
            )}
          </React.Fragment>
        ))}
      </ResultTable>
      {/* <h1>課題別結果</h1>
      { problems.length > 0 && (
      <table>
        <thead>
          <tr>
            {problems.map((problem, index) => (
              <th>{problem.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {problems.map((problem, index) => (
              <th key={index} onClick={() => handleCheckListRowClick(index)}>
                {// problem.assignment_idから該当するSubmissionSummaryのresultを取得
                  evaluationStatus?.submissions[index]?.result
                }
              </th>
            ))}
          </tr>
        </tbody>
      </table>
      )} */}
      
      {/* <CheckListTable>
        <thead>
          <tr>
            <th></th>
            <th>チェック項目</th>
            <th>結果</th>
            <th>実行時間</th>
            <th>メモリ</th>
          </tr>
        </thead>
        <tbody>
          {selectedId !== null && evaluationStatus?.submissions[selectedId].judge_results.map((judge_result, index) => (
            <React.Fragment key={judge_result.id}>
                <CheckListRow key={judge_result.id}>
                  <td>
                    <ExpandButton onClick={() => toggleRow(judge_result.id)}>
                      {expandedRows.includes(judge_result.id) ? '▼' : '▶'}
                    </ExpandButton>
                  </td>
                  <td>{testCaseId2TestCase.get(judge_result.testcase_id)?.description || ''}</td>
                  <td>{judge_result.result}</td>
                  <td>{judge_result.timeMS}ms</td>
                  <td>{judge_result.memoryKB}KB</td>
                </CheckListRow>
                {expandedRows.includes(judge_result.id) && (
                  <ExpandedRow>
                  <td colSpan={5}>
                    <JudgeResultsViewer result={judge_result} testCase={testCaseId2TestCase.get(judge_result.testcase_id)!} />
                  </td>
                </ExpandedRow>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </CheckListTable> */}
    </div>
  );

};

export default BatchUserDetail;

const Divider = styled.hr`
    border: none;
    height: 1px;
    background-color: #E0E0E0;
    margin: 0;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    background-color: #B8B8B8;
    padding: 10px;
`;

const ResultContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px;
    gap: 10px;
    background-color: #FFFFFF;
`;

const ColumnContainer = styled.div`
    flex: 1;
`;

// ヘッダー用の新しいColumnContainer
const HeaderColumnContainer = styled(ColumnContainer)<{ isActive: boolean }>`
    cursor: ${props => props.isActive ? 'default' : 'pointer'};
    height: 100%;
    margin: -10px -10px;  // HeaderContainerのパディングを打ち消す
    padding: 10px 10px;  // 同じ分のパディングを追加して見た目を維持
    background-color: ${props => props.isActive ? '#898989' : 'transparent'};
    &:hover {
        background-color: ${props => props.isActive ? '#898989' : '#898989'};
    }
`;

const HeaderItem = styled.div`
    font-size: 25px;
    font-family: Inter;
    font-weight: 600;
    color: #FFFFFF;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ResultItem = styled.div`
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LinkButton = styled.a`
    color: #0000EE;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`
const Dropdown = styled.select`
    border-radius: 6px;
    border: 1px solid #B8B8B8;
    padding: 0 8px;
    margin-right: 8px;
    height: 40px;
    font-size: 14px;
    box-sizing: border-box;
    padding-right: 24px;
    cursor: pointer;
`;

const ResultTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const ResultHeader = styled.div`
  display: flex;
  background-color: #B8B8B8;
  color: #FFFFFF;
  font-weight: 600;
  // padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ResultHeaderCell = styled.div<{ align?: string }>`
  flex: ${props => props.align === 'term' ? '3' : '1'};  // 項目のセルを2、結果のセルを1の比率に
  font-size: 25px;
  font-family: Inter;
  padding: 10px;
  text-align: ${props => props.align === 'term' ? 'center' : 'center'};
  padding-right: ${props => props.align === 'result' ? '10px' : '10px'};  // 結果セルの右パディングを調整（ExpandIconとの余白分）
`;

const ResultRow = styled.div<{ isExpanded: boolean }>`
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-top: 1px solid #E0E0E0;
  cursor: pointer;
  padding: 10px;
  
  &:hover {
    background-color: #F5F5F5;
  }
`;


const ResultCell = styled.div`
  flex: 1;
  font-size: 14px;
  padding: 10px;
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  position: relative;
  width: 10px;
  height: 10px;
  margin-left: auto;
  margin-right: 10px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 50%;
    height: 2px;
    background-color: #666;
    transition: transform 0.3s ease;
  }

  &::before {
    left: 0;
    transform: ${props => props.isExpanded 
      ? 'rotate(135deg)' 
      : 'rotate(45deg)'};
    transform-origin: 100% 100%;
  }

  &::after {
    right: 0;
    transform: ${props => props.isExpanded 
      ? 'rotate(-135deg)' 
      : 'rotate(-45deg)'};
    transform-origin: 0 100%;
  }
`;

const ExpandedContent = styled.div`
  padding: 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #E0E0E0;
`;

