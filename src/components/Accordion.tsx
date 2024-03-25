// import React, { useState } from 'react';

// interface AccordionProps {
//   title: string;
//   content: string[];
// }

// const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggle = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div>
//       <div 
//         onClick={toggle} 
//         style={{ 
//           cursor: 'pointer', 
//           backgroundColor: '#f9f9f9', 
//           padding: '10px', 
//           borderRadius: '5px', 
//           border: '1px solid #ddd', 
//           marginBottom: '5px' 
//         }}
//       >
//         {title} {isOpen ? '▲' : '▼'}
//       </div>
//       {isOpen && (
//         <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
//           {content.map((line, index) => (
//             <pre key={index} style={{ margin: 0 }}>
//               {line}
//             </pre>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Accordion;
import React, { useState } from 'react';
import styled from 'styled-components';

interface AccordionProps {
  title: string;
  content: string[];
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionWrapper>
      <AccordionHeader onClick={() => setIsOpen(!isOpen)}>
        {title} {isOpen ? '▲' : '▼'}
      </AccordionHeader>
      <AccordionContent isOpen={isOpen}>
        {content.map((line, index) => (
          <pre key={index} style={{ margin: 0 }}>
            {line}
          </pre>
        ))}
      </AccordionContent>
    </AccordionWrapper>
  );
};

export default Accordion;

const AccordionWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #ddd;
  overflow: hidden;
`;

const AccordionHeader = styled.div`
  background-color: #f9f9f9;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
`;

const AccordionContent = styled.div<{ isOpen: boolean }>`
  padding: 10px;
  background-color: #f0f0f0;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;
