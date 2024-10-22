import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import { createUser } from '../api/PostAPI';
import { CreateUser } from '../types/user';
import { useAuth } from '../context/AuthContext';
import StudentListUploadBox from '../components/StudentListUploadBox';
import useApiClient from '../hooks/useApiClient';
import { UserRole } from '../types/token';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [user_id, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.student);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [activeStartDate, setActiveStartDate] = useState<Date | null>(new Date(2024, 10, 1, 9, 0, 0));
    const [activeEndDate, setActiveEndDate] = useState<Date | null>(new Date(2025, 3, 1, 23, 59, 59));
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
            setActiveStartDate(new Date(2024, 10, 1, 9, 0, 0));
            setActiveEndDate(new Date(2025, 3, 1, 23, 59, 59));
            setError('');
            navigate('/users/management');
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
                        <DatePicker 
                            selected={activeStartDate}
                            onChange={(date: Date | null) => setActiveStartDate(date)}
                            showTimeSelect
                            dateFormat="yyyy/MM/dd HH:mm"
                        />
                    </div>
                    <small>指定しない場合は無期限として扱われます。</small>
                </div>
                <div>
                    <label>有効終了日時:</label>
                    <div>
                        <DatePicker 
                            selected={activeEndDate}
                            onChange={(date: Date | null) => setActiveEndDate(date)}
                            showTimeSelect
                            dateFormat="yyyy/MM/dd HH:mm"
                        />
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