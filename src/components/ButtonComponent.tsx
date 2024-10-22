import styled from "styled-components";
import React, { useState } from "react";

interface ButtonComponentProps {
    onClick: () => void;
    label: string;
    disabled?: boolean;
    width?: string;
    height?: string;
    fontSize?: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ onClick, label, disabled = false, width, height, fontSize = '16px' }) => {

    return (
        <StyledButton 
            onClick={onClick} 
            disabled={disabled} 
            width={width}
            height={height}
            fontSize={fontSize}
        >
            {label}
        </StyledButton>
    );
};

export default ButtonComponent;

const StyledButton = styled.button<{ width?: string; height?: string; fontSize?: string }>`
    background-color: white;
    border: 1px solid black;
    border-radius: 15px;
    color: black;
    font-size: ${(props) => props.fontSize || '16px'};
    cursor: pointer;
    width: ${(props) => props.width || 'auto'};
    height: ${(props) => props.height || 'auto'};
    transition: background-color 0.1s;
    white-space: nowrap;
    padding: 0 12px;

    &:hover {
        background-color: #B8B8B8;
    }

    &:active {
        background-color: #898989;
    }

    &:disabled {
        background-color: white;
        color: #D9D9D9;
        border-color: #D9D9D9;
        cursor: not-allowed;
    }
`;