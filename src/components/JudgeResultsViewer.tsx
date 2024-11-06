import React from 'react';
import { JudgeResult, TestCases } from '../types/Assignments';
import {
  Paper, Typography, Box, TextField, Stack, Divider, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

// JudgeResult[]を引数として受け取り、それらを表示するコンポーネント
interface JudgeResultsViewerProps {
  result: JudgeResult;
  testCase: TestCases | undefined;
};

const ScrollableTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    maxHeight: '150px',
    overflow: 'auto',
  },
  '& .MuiInputBase-input': {
    fontFamily: 'monospace',
  },
});

const JudgeResultsViewer: React.FC<JudgeResultsViewerProps> = ({ result, testCase }) => {
  if (!testCase) return <div>Error: Test case not found</div>;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ mb: 2}}>
        <Typography variant="h6" component="div">
          Test: #{result.testcase_id}
          <Chip 
            label={result.result}
            color={result.result === 'AC' ? 'success' : 'error'}
            size="small"
            sx={{ ml: 1 }}  
          />
        </Typography>
        <Typography color="text.secondary">
          実行時間: {result.timeMS}ms, メモリ: {result.memoryKB}KB
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography>
          Exit code: {result.exit_code}
          {' / '}
          Exit code (expected): {testCase.exit_code !== 0 ? 'panic(except for 0)' : testCase.exit_code}
        </Typography>
      </Box>

      <Divider sx={{ my: 2}}/>

      <Stack spacing={2}>
        {/* 標準入力 */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>標準入力:</Typography>
          <ScrollableTextField
            fullWidth
            multiline
            variant="outlined"
            value={testCase.stdin || '(No input)'}
            slotProps={{
              input: { readOnly: true },
            }}
          />
        </Box>

        {/* 標準出力 */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box flex={1}>
            <Typography variant="subtitle2" gutterBottom>標準出力:</Typography>
            <ScrollableTextField
              fullWidth
              multiline
              variant="outlined"
              value={result.stdout}
              slotProps={{
                input: { readOnly: true },
              }}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2" gutterBottom>標準出力(想定):</Typography>
            <ScrollableTextField
              fullWidth
              multiline
              variant="outlined"
              value={testCase.stdout || '(No expected output)'}
              slotProps={{
                input: { readOnly: true },
              }}
            />
          </Box>
        </Stack>

        {/* 標準エラー出力 */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box flex={1}>
            <Typography variant="subtitle2" gutterBottom>標準エラー出力:</Typography>
            <ScrollableTextField
              fullWidth
              multiline
              variant="outlined"
              value={result.stderr}
              slotProps={{
                input: { readOnly: true },
              }}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle2" gutterBottom>標準エラー出力(想定):</Typography>
            <ScrollableTextField
              fullWidth
              multiline
              variant="outlined"
              value={testCase.stderr || '(No expected stderr)'}
              slotProps={{
                input: { readOnly: true },
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  )

  // return (
  //   <div>
  //     {testCase && (
  //       <JudgeResultContainer key={result.id}>
  //         <h3>Test: #{result.testcase_id}, time: {result.timeMS}ms, memory: {result.memoryKB}KB, result: {result.result}</h3>
  //         <ExecCommandContainer>
  //           <h4>Exec command:</h4>
  //           <CommandBox>{result.command}</CommandBox>
  //         </ExecCommandContainer>
  //         <IOContainer>
  //           <InputOutputBox>
  //             <h4>標準入力:</h4>
  //             <ScrollBarContent>
  //               {testCase.stdin || '(No input)'}
  //             </ScrollBarContent>
  //           </InputOutputBox>
  //           <InputOutputBox>
  //             <h4>標準出力:</h4>
  //             <ScrollBarContent>
  //               {result.stdout}
  //             </ScrollBarContent>
  //           </InputOutputBox>
  //           <InputOutputBox>
  //             <h4>標準出力(想定):</h4>
  //             <ScrollBarContent>
  //               {testCase.stdout || '(No expected output)'}
  //             </ScrollBarContent>
  //           </InputOutputBox>
  //         </IOContainer>

  //         <IOContainer>
  //           <InputOutputBox>
  //             <h4>標準エラー出力:</h4>
  //             <ScrollBarContent>
  //               {result.stderr}
  //             </ScrollBarContent>
  //           </InputOutputBox>
  //           <InputOutputBox>
  //             <h4>標準エラー出力(想定):</h4>
  //             <ScrollBarContent>
  //               {testCase.stderr || '(No expected stderr)'}
  //             </ScrollBarContent>
  //           </InputOutputBox>
  //         </IOContainer>
  //         <ExitCodeContainer>
  //           <p>Exit code: {result.exit_code}</p>
  //           <p>Exit code (expected): {testCase.exit_code !== 0 ? 'panic(except for 0)' : testCase.exit_code}</p>
  //         </ExitCodeContainer>
  //         </JudgeResultContainer>
  //     )}
  //   </div>
  // );
};

export default JudgeResultsViewer;

