import React from 'react';

interface CodeBlockProps {
  lines: string[];
}

const CodeBlock: React.FC<CodeBlockProps> = ({ lines }) => {
  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
      {lines.map((line, index) => (
        <pre key={index} style={{ margin: 0 }}>
          {line}
        </pre>
      ))}
    </div>
  );
};

export default CodeBlock;
