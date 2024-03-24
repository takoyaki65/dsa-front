import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Assignment } from '../types/Assignments';
import { fetchAssignments } from '../api/GetAPI';

const Sidebar: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  useEffect(() => {
    const getAssignments = async () => {
      const assignmentsData = await fetchAssignments();
      setAssignments(assignmentsData);
    };

    getAssignments();
  }, []);

    // 現在の日付がstart_dateとend_dateの間にある課題のみをフィルタリング
    const now = new Date();
    const filteredAssignments = assignments.filter(assignment => {
      const startDate = new Date(assignment.start_date);
      const endDate = new Date(assignment.end_date);
      return startDate <= now && now <= endDate;
    });
  
    return (
      <div className="sidebar">
        <ul>
          <Link to="/"><h3>ホーム</h3></Link>
          {filteredAssignments.map(assignment => (
            <li key={assignment.id}>
              <Link to={`/submission/${assignment.id}`}>
                <h3>{assignment.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Sidebar;
