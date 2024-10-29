import styled from "styled-components";
import React from "react";
import { Colors } from '../styles/colors';
import { SubmissionSummaryStatus } from "../types/Assignments";

interface StatusButtonProps {
    status: SubmissionSummaryStatus | "提出" | "遅延" | "未提出" | "エラー" | "submitted" | "delay" | "non-submitted";
    isButton?: boolean;
    onClick?: () => void;
    color?: typeof Colors;
}

const statusDescriptions: { [key: string]: string } = {
    AC: "Accepted - 正解",
    WA: "Wrong Answer - 不正解",
    TLE: "Time Limit Exceed - 実行時間超過",
    MLE: "Memory Limit Exceed - メモリ使用量超過",
    RE: "Runtime Error - 実行時エラー",
    CE: "Compile Error - コンパイルエラー",
    OLE: "Output Limit Exceed - 出力サイズ超過",
    IE: "Internal Error - 内部エラー",
    FN: "File Not found - ファイル未検出",
    "提出": "提出済み",
    "遅延": "遅延提出",
    "未提出": "未提出",
};

const StatusButton: React.FC<StatusButtonProps> = ({ status, isButton = false, onClick, color = Colors }) => {
    if (status === "submitted") {
        status = "提出";
    } else if (status === "delay") {
        status = "遅延";
    } else if (status === "non-submitted") {
        status = "未提出";
    }
    
    // 略称の場合のみツールチップを表示
    const showTooltip = ["AC", "WA", "TLE", "MLE", "RE", "CE", "OLE", "IE", "FN"].includes(status);
    
    return (
        <TooltipContainer>
            <StyledStatusButton 
                as={isButton ? "button" : "span"}
                $status={status} 
                $isButton={isButton} 
                onClick={isButton ? onClick : undefined}
                $color={color}
            >
                {status}
            </StyledStatusButton>
            {showTooltip && (
                <Tooltip>
                    {statusDescriptions[status]}
                </Tooltip>
            )}
        </TooltipContainer>
    );
};

const TooltipContainer = styled.div`
    position: relative;
    display: inline-block;
`;

const Tooltip = styled.div`
    visibility: hidden;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    text-align: left;
    padding: 5px 10px;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    font-size: 14px;
    font-weight: normal;
    
    /* 左向きの矢印 */
    &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 100%;
        margin-top: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent rgba(0, 0, 0, 0.8) transparent transparent;
    }

    ${TooltipContainer}:hover & {
        visibility: visible;
    }
`;

export default StatusButton;

const getStatusColor = (status: string, isHovered: boolean, isActive: boolean, color: typeof Colors) => {
    const colorKey = ["AC", "提出"].includes(status)
        ? "green"
        : ["WA", "遅延"].includes(status)
        ? "yellow"
        : "red";

    if (isActive) {
        return color.button[colorKey].active;
    } else if (isHovered) {
        return color.button[colorKey].hover;
    } else {
        return color.button[colorKey].base;
    }
};

const StyledStatusButton = styled.button<{ $status: string; $isButton: boolean; $color: typeof Colors }>`
    background-color: ${(props) => getStatusColor(props.$status, false, false, props.$color)};
    color: white;
    border: none;
    border-radius: 20px;
    padding: 0 10px;
    height: 24px;
    min-width: 64px;
    text-align: center;
    font-family: 'Inter';
    font-weight: 700;
    cursor: ${(props) => (props.$isButton ? "pointer" : "default")};
    transition: background-color 0.1s;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    pointer-events: ${(props) => (props.$isButton ? 'auto' : 'none')};

    &:hover {
        background-color: ${(props) =>
            props.$isButton
                ? getStatusColor(props.$status, true, false, props.$color)
                : getStatusColor(props.$status, false, false, props.$color)};
    }

    &:active {
        background-color: ${(props) =>
            props.$isButton
                ? getStatusColor(props.$status, false, true, props.$color)
                : getStatusColor(props.$status, false, false, props.$color)};
    }
`;
