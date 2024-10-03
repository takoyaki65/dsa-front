import React, { useState } from 'react';
import { createUser } from '../api/PostAPI';
import { CreateUser } from '../types/user';
import { useAuth } from '../context/AuthContext';
import StudentListUploadBox from '../components/StudentListUploadBox';
import useApiClient from '../hooks/useApiClient';
import { UserRole } from '../types/token';

const RegisterPage: React.FC = () => {
    const [user_id, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.student);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [activeStartYear, setActiveStartYear] = useState(2024);
    const [activeStartMonth, setActiveStartMonth] = useState(10);
    const [activeStartDay, setActiveStartDay] = useState(17);
    const [activeStartHour, setActiveStartHour] = useState(9);
    const [activeStartMinute, setActiveStartMinute] = useState(0);
    const [activeEndYear, setActiveEndYear] = useState(2025);
    const [activeEndMonth, setActiveEndMonth] = useState(3);
    const [activeEndDay, setActiveEndDay] = useState(1);
    const [activeEndHour, setActiveEndHour] = useState(23);
    const [activeEndMinute, setActiveEndMinute] = useState(59);
    const { apiClient } = useApiClient();
    const { user_id: login_user_id, role: login_user_role, logout } = useAuth(); // useAuthから現在のユーザー情報も取得する
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.includes('@')) {
            setError('メールアドレスの形式が正しくありません。');
            return;
        }

        if (!email.endsWith('tsukuba.ac.jp')) {
            setError('tsukuba.ac.jpで終わるメールアドレスを入力してください。');
            return;
        }

        if (password !== confirmPassword) {
            setError('パスワードが一致しません。');
            return;
        }

        // 有効開始日時と有効終了日時のチェック
        // activeStartYear/Month/Day/Hour/Minute/SecondからDateを作成
        const activeStartDate = new Date(activeStartYear, activeStartMonth, activeStartDay, activeStartHour, activeStartMinute, 0);
        const activeEndDate = new Date(activeEndYear, activeEndMonth, activeEndDay, activeEndHour, activeEndMinute, 0);

        if (activeStartDate && activeEndDate && new Date(activeStartDate) > new Date(activeEndDate)) {
            setError('有効開始日時は有効終了日時より前でなければなりません。');
            return;
        }

        const newUser: CreateUser = {
            user_id: user_id,
            username: username,
            email: email,
            plain_password: password,
            role: role,
            disabled: disabled,
            active_start_date: activeStartDate || null,
            active_end_date: activeEndDate || null,
        };

        try {
            await apiClient({apiFunc: createUser, args: [newUser]});
            alert('アカウントが正常に作成されました。');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setRole(UserRole.student);
            setDisabled(false);
            setActiveStartYear(2024);
            setActiveStartMonth(10);
            setActiveStartDay(17);
            setActiveStartHour(9);
            setActiveStartMinute(0);
            setActiveEndYear(2025);
            setActiveEndMonth(3);
            setActiveEndDay(1);
            setActiveEndHour(23);
            setActiveEndMinute(59);
            setError('');
            // 登録後の処理（例：ログインページへのリダイレクト）
        } catch (error) {
            console.error('アカウントの作成に失敗しました。', error);
            setError(`アカウントの作成に失敗しました: ${(error as any).response.data.detail}`);
        }
    };

    if (login_user_id === null) {
        logout();
    }
    if (login_user_role !== UserRole.admin) {
        return <p>管理者権限がありません。</p>;
    }

    return (
        <div>
            <h2>アカウント登録</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <div>
                    <label>学籍番号:</label>
                    <input type="text" value={user_id} onChange={(e) => setUserId(e.target.value)} required />
                </div>
                <div>
                    <label>ユーザー名:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>メールアドレス:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>パスワード:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>パスワード確認:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div>
                    <label>役職:</label>
                    <input type="radio" name="role" value="student" onChange={() => setRole(UserRole.student)} /> 学生
                    <input type="radio" name="role" value="manager" onChange={() => setRole(UserRole.manager)} /> 採点者
                </div>
                {/* <div>
                    <label>有効化: </label>
                    <input type="radio" name="disabled" value="true" onChange={() => setDisabled(true)} /> はい
                    <input type="radio" name="disabled" value="false" onChange={() => setDisabled(false)} checked /> いいえ
                </div> */}
                <div>
                    <label>有効開始日時:</label>
                    <div>
                        <input type="number" value={activeStartYear} onChange={(e) => setActiveStartYear(Number(e.target.value))} placeholder="年" />
                        <input type="number" value={activeStartDay} onChange={(e) => setActiveStartDay(Number(e.target.value))} placeholder="日" />
                        <input type="number" value={activeStartHour} onChange={(e) => setActiveStartHour(Number(e.target.value))} placeholder="時" />
                        <input type="number" value={activeStartMinute} onChange={(e) => setActiveStartMinute(Number(e.target.value))} placeholder="分" />
                    </div>
                    <small>指定しない場合は無期限として扱われます。</small>
                </div>
                <div>
                    <label>有効終了日時:</label>
                    <div>
                        <input type="number" value={activeEndYear} onChange={(e) => setActiveEndYear(Number(e.target.value))} placeholder="年" />
                        <input type="number" value={activeEndDay} onChange={(e) => setActiveEndDay(Number(e.target.value))} placeholder="日" />
                        <input type="number" value={activeEndHour} onChange={(e) => setActiveEndHour(Number(e.target.value))} placeholder="時" />
                        <input type="number" value={activeEndMinute} onChange={(e) => setActiveEndMinute(Number(e.target.value))} placeholder="分" />
                    </div>
                    <small>指定しない場合は無期限として扱われます。</small>
                </div>
                <button type="submit">登録</button>
            </form>
            <StudentListUploadBox />
        </div>
    );
};

export default RegisterPage;