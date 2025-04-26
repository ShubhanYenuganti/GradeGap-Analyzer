import React, { useEffect, useState } from 'react';
import api from '../api/api';

function InsightsViewer({ classId }) {
  const [insights, setInsights] = useState('');

//   useEffect(() => {
//     const fetchInsights = async () => {
//       const response = await api.get(`/get_insights?class_id=${classId}`);
//       setInsights(response.data.insights);
//     };
//     fetchInsights();
//   }, [classId]);

  return (
    <div>
      <pre>{insights}</pre>
    </div>
  );
}

export default InsightsViewer;