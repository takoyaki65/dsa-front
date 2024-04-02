import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { SubAssignmentDropdown, SubAssignmentDetail } from '../types/Assignments';
import { fetchSubAssignmentDetail, fetchSubAssignments } from '../api/GetAPI';
import Dropdown from '../components/Dropdown';
import CodeBlock from '../components/CodeBlock';
import Accordion from '../components/Accordion';
import FileUploadBox from '../components/FileUploadBox';
import {useAuth} from '../context/AuthContext';

const SubmissionPage: React.FC = () => {
	const { problemNum } = useParams<{ problemNum: string }>();
	const [subAssignmentsDropdown, setSubAssignmentsDropdown] = useState<SubAssignmentDropdown[]>([]);
	const [subAssignmentDetail, setSubAssignmentDetail] = useState<SubAssignmentDetail | null>(null);
	const [hasError, setHasError] = useState(false);
	const { token } = useAuth();
	useEffect(() => {
		const getSubAssignmentsDropdown = async () => {
			try {
				const data = await fetchSubAssignments(problemNum ?? '', token);
				setSubAssignmentsDropdown(data);
				setHasError(false); // 成功した場合はエラー状態をリセット
			} catch (error) {
				setHasError(true); // エラーが発生した場合はエラー状態をtrueに
			}
		};
		setSubAssignmentsDropdown([]);
		setSubAssignmentDetail(null);
		getSubAssignmentsDropdown();
	}, [problemNum]);
	
	const handleSelect = async (id: number | null, subId: number | null) => {
		if (id === null || subId === null) {
			setSubAssignmentDetail(null);
			return;
		}
		try {
			const detail = await fetchSubAssignmentDetail(id.toString(), subId.toString(), token);
			setSubAssignmentDetail(detail);
			setHasError(false); // 成功した場合はエラー状態をリセット
		} catch (error) {
			setHasError(true); // エラーが発生した場合はエラー状態をtrueに
		}
	};

	if (hasError) {
		// エラーがある場合はNotFoundメッセージを表示
		return <>
		<h1>Not Found</h1>
		<div>指定された課題は存在しないか，未公開です．</div>
		</>;
	}

	return (
		<div style={{ paddingBottom: '100px'}}>
			<h1>課題{problemNum}確認ページ</h1>
			<Dropdown subAssignmentsDropdown={subAssignmentsDropdown} onSelect={handleSelect} />
			{subAssignmentDetail && (
				<div>
					<h2>課題詳細</h2>
					<h3>使用するmakefile</h3>
					<p>※提出された関数ファイルはテスト用のmainファイルと以下のmakefileを使ってコンパイルされます。</p>
					<CodeBlock lines={subAssignmentDetail.makefile.split('\n')} />
					<h3>提出するファイル名</h3>
					<p>以下のファイルを提出してください．</p>
					<ul>
						<li>{subAssignmentDetail.required_file_name}</li>
					</ul>
					<h3>テストに使用するmainファイル</h3>
					{subAssignmentDetail.test_program ? (
						<Accordion title={subAssignmentDetail.test_file_name} content={subAssignmentDetail.test_program.split('\n')} />
					) : (
						<div style={{ color: 'red' }}>データの取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．</div>
					)}
					<h3>期待する出力</h3>
					{subAssignmentDetail.test_output ? (
						<CodeBlock lines={subAssignmentDetail.test_output.split('\n')} />
					) : (
						<div style={{ color : 'red' }}>データの取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．</div>
					)}
					<h3>提出</h3>
					<p>指定されたファイルを選択し，アップロードしてください．ファイルはドラッグ&ドロップでも選択可能です．</p>
					<FileUploadBox id={subAssignmentDetail.id} sub_id={subAssignmentDetail.sub_id} fileName={subAssignmentDetail.required_file_name} fileNum={1} />
				</div>
			)}
		</div>
	);
	return (
		<div>
		<h1>課題{problemNum}確認ページ</h1>
		<p>問題番号 {problemNum} に対する提出作業を行ってください。</p>
		</div>
	);
};

export default SubmissionPage;
