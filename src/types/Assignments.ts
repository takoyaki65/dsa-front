// 課題の型を定義
export type Assignment = {
    id: number;
    title: string;
    start_date: Date;
    end_date: Date;
  };

// subAssignmentsの全体の型定義
export type SubAssignment = {
    id: number;
    sub_id: number;
    title: string;
    makefile: string;
    required_file_name: string;
    test_file_name: string;
    test_input: string;
    test_output: string;
    test_program: string;
  };
  
  // プルダウンで使用する型定義（問題名のみ）
  export type SubAssignmentDropdown = Pick<SubAssignment, 'id' | 'sub_id' | 'title'>;
  
  // 選択された後に表示する情報用の型定義
  export type SubAssignmentDetail = Pick<SubAssignment, 'id' | 'sub_id' | 'makefile' | 'required_file_name' | 'test_file_name' | 'test_input' | 'test_output' | 'test_program'>;
