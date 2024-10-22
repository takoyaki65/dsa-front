import styled from "styled-components";
import React from "react";

// ただ結果を表示するアイコンとして利用する場合はisButtonはfalse．
// 結果の詳細を確認するなど，ボタンとして利用する場合はtrueにする．
interface StatusButtonProps {
    status: "AC" | "WA" | "CE" | "提出" | "遅延" | "未提出";
    isButton?: boolean;
    onClick?: () => void;
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, isButton = false, onClick }) => {
    return (
        <StyledStatusButton 
            status={status} 
            isButton={isButton} 
            onClick={isButton ? onClick : undefined} // ボタン用途がない場合はonClickを設定しない
        >
            {status}
        </StyledStatusButton>
    );
};

export default StatusButton;

// ステータスごとの色を設定
const getStatusColor = (status: string, isHovered: boolean, isActive: boolean) => {
    // 通常時、ホバー時、アクティブ時のカラーを設定
    const colorMap = {
        green: {
            base: "rgba(46, 242, 35, 0.5)",  // グリーン系50%
            hover: "#2EF223",                // グリーン系100%
            active: "#1CAE15"                // グリーン系クリック時
        },
        yellow: {
            base: "rgba(226, 212, 59, 0.5)", // イエロー系50%
            hover: "#E2D43B",                // イエロー系100%
            active: "#B9AD2C"                // イエロー系クリック時
        },
        red: {
            base: "rgba(221, 68, 48, 0.5)",  // レッド系50%
            hover: "#DD4430",                // レッド系100%
            active: "#AB3222"                // レッド系クリック時
        }
    };

    // ステータスに応じた色を取得
    const colorKey = ["AC", "提出"].includes(status)
        ? "green"
        : ["WA", "遅延"].includes(status)
        ? "yellow"
        : "red";

    // 色を返す
    if (isActive) {
        return colorMap[colorKey].active;
    } else if (isHovered) {
        return colorMap[colorKey].hover;
    } else {
        return colorMap[colorKey].base;
    }
};

// StyledComponentの定義
const StyledStatusButton = styled.button<{ status: string; isButton: boolean }>`
    background-color: ${(props) => getStatusColor(props.status, false, false)};
    color: white;
    border: none;
    border-radius: 20px;
    width: 62px;
    height: 24px;
    text-align: center;
    font-family: 'Inter';
    font-weight: 700;
    cursor: ${(props) => (props.isButton ? "pointer" : "default")};
    transition: background-color 0.1s;
    user-select: none;

    &:hover {
        background-color: ${(props) => props.isButton ? getStatusColor(props.status, true, false) : getStatusColor(props.status, false, false)};
    }

    &:active {
        background-color: ${(props) => props.isButton ? getStatusColor(props.status, false, true) : getStatusColor(props.status, false, false)};
    }
`;
