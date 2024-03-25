import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { SubAssignmentDropdown, SubAssignmentDetail } from '../types/Assignments';
import { fetchSubAssignmentDetail, fetchSubAssignments } from '../api/GetAPI';
import Dropdown from '../components/Dropdown';
import CodeBlock from '../components/CodeBlock';
import Accordion from '../components/Accordion';

const codeLines = [
	"# Example Code",
	"def hello_world():",
	"    print('Hello, world!')",
	"",
	"hello_world()"
  ];
  

const SubmissionPage: React.FC = () => {
	const { problemNum } = useParams<{ problemNum: string }>();
	const [subAssignmentsDropdown, setSubAssignmentsDropdown] = useState<SubAssignmentDropdown[]>([]);
	const [subAssignmentDetail, setSubAssignmentDetail] = useState<SubAssignmentDetail | null>(null);
	useEffect(() => {
		const getSubAssignmentsDropdown = async () => {
			const data = await fetchSubAssignments(problemNum ?? '');
			setSubAssignmentsDropdown(data);
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
		const detail = await fetchSubAssignmentDetail(id.toString(), subId.toString());
		setSubAssignmentDetail(detail);
	};

	return (
		<div>
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
					<Accordion title={subAssignmentDetail.test_file_name} content={codeLines} />
					<h3>期待する出力</h3>
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
