import React from 'react';
import { JudgeResult } from '../types/Assignments';
import styled from 'styled-components';

// JudgeResult[]を引数として受け取り、それらを表示するコンポーネント
interface JudgeResultsViewerProps {
  results: JudgeResult[];
};

const JudgeResultsViewer: React.FC<JudgeResultsViewerProps> = ({ results }) => {
  return (
    <div>
      {results.map((result) => (
        <JudgeResultContainer key={result.id}>
          <h3>Test: #{result.testcase_id}, time: {result.timeMS}ms, memory: {result.memoryKB}KB, result: {result.result}</h3>
          <ExecCommandContainer>
            <h4>Exec command:</h4>
            <CommandBox>{result.command}</CommandBox>
          </ExecCommandContainer>
          <IOContainer>
            <InputOutputBox>
              <h4>標準入力:</h4>
              <ScrollBarContent>
                {result.stdin || 'No input'}
              </ScrollBarContent>
            </InputOutputBox>
            <InputOutputBox>
              <h4>標準出力:</h4>
              <ScrollBarContent>
                {result.stdout}
              </ScrollBarContent>
            </InputOutputBox>
            <InputOutputBox>
              <h4>標準出力(想定):</h4>
              <ScrollBarContent>
                {result.expected_stdout || 'No expected output'}
              </ScrollBarContent>
            </InputOutputBox>
          </IOContainer>

          <IOContainer>
            <InputOutputBox>
              <h4>標準エラー出力:</h4>
              <ScrollBarContent>
                {result.stderr}
              </ScrollBarContent>
            </InputOutputBox>
            <InputOutputBox>
              <h4>標準エラー出力(想定):</h4>
              <ScrollBarContent>
                {result.expected_stderr || 'No expected stderr'}
              </ScrollBarContent>
            </InputOutputBox>
          </IOContainer>
          <ExitCodeContainer>
            <p>Exit code: {result.exit_code}</p>
            <p>Exit code (expected): {result.expected_exit_code}</p>
          </ExitCodeContainer>
        </JudgeResultContainer>
      ))}
    </div>
  );
};

export default JudgeResultsViewer;


const JudgeResultContainer = styled.div`
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 10px;
`;


const ExecCommandContainer = styled.div`
  margin-bottom: 10px;
`;


const CommandBox = styled.div`
  background-color: #f0f0f0;
  padding: 5px;
  border-radius: 3px;
`;


const IOContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;


const InputOutputBox = styled.div`
  width: 48%;
`;

const ScrollBarContent = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ExitCodeContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;