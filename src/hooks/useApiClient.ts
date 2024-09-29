import { useAuth } from '../context/AuthContext';
import { updateToken } from '../api/GetAPI';

const useApiClient = () => {
    const { token, setToken, logout } = useAuth();

    const refreshAccessToken = async (): Promise<string | null> => {
        try {
            const response = await updateToken(token);
            if (response) {
                const newToken = response;
                setToken(newToken);
                return newToken;
            }
        } catch (error) {
            console.error('トークンのリフレッシュに失敗しました:', error);
            return null;
        }
        return null;
    };

    const apiClient = async <T>({
        apiFunc,
        args = []
    }: {
        apiFunc: (...args: any[]) => Promise<T>,
        args?: any[]
    }): Promise<T> => {
        // 引数がtokenを必要とする場合、tokenを自動的に追加
        const needsToken = apiFunc.length > args.length; // 引数にtokenが必要かどうかを判定
        const adjustedArgs = needsToken ? [...args, token] : args;
        try {
            // API関数を実行
            console.log("First try")
            return await apiFunc(...adjustedArgs);
        } catch (error: any) {
            console.log(`Error: ${error}, status: ${error.response?.status}`)
            if (error.response?.status === 401) {
                console.log("Token refreshed")
                const refreshedToken = await refreshAccessToken();
                if (refreshedToken) {
                    const adjustedArgs = needsToken ? [...args, refreshedToken] : args;
                    console.log("Second try")
                    return await apiFunc(...adjustedArgs); // トークンをリフレッシュ後に再試行
                } else {
                    console.log("Logout")
                    logout();
                    throw new Error('セッションが切れました。再度ログインしてください。');
                }
            } else {
                console.error('APIリクエストエラー:', error);
                const errorMessage = '予期せぬエラーが発生しました。再度ログインしてください。';
                alert(errorMessage);
                logout();
            }
            throw error;
        }
    };

    return { apiClient };
};

export default useApiClient;
