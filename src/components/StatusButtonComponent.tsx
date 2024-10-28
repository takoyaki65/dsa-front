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

const StatusButton: React.FC<StatusButtonProps> = ({ status, isButton = false, onClick, color = Colors }) => {
    if (status === "submitted") {
        status = "提出";
    } else if (status === "delay") {
        status = "遅延";
    } else if (status === "non-submitted") {
        status = "未提出";
    }
    return (
        <StyledStatusButton 
            as={isButton ? "button" : "span"} /* 'div' から 'span' に変更 */
            $status={status} 
            $isButton={isButton} 
            onClick={isButton ? onClick : undefined}
            $color={color}
        >
            {status}
        </StyledStatusButton>
    );
};

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
    pointer-events: ${(props) => (props.$isButton ? 'auto' : 'none')}; /* この行を追加 */

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
