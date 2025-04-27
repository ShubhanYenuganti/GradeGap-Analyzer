import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../styles/InsightsViewer.css'; // Optional for animations

function InsightsViewer() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [insight, setInsight] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in first!');
                return;
            }
            try {
                const response = await api.get(`/api/classes/all/${userId}`);
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            } finally {
                setLoading(false);
            }
        };  

        fetchClasses();
    }, []);

    const handleClassChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedClassId(selectedId);
    
        const userId = localStorage.getItem('userId'); // 👈 Need to get the userId
    
        try {
            const response = await api.get(`/api/classes/insights/${selectedId}/${userId}`);
            setInsight(response.data.insights || '<div>No insights available.</div>');
        } catch (error) {
            console.error('Error fetching insights:', error);
            setInsight('<div>Failed to fetch insights.</div>');
        }
    };

    if (loading) {
        return <div className="loading">Loading classes...</div>;
    }

    return (
        <div className="insights-viewer">
            <div className="insights-box">
                <select
                    value={selectedClassId}
                    onChange={handleClassChange}
                    className="category-select"
                >
                    <option value="" disabled>Select a Class</option>
                    {classes.map((classItem) => (
                        <option key={classItem._id} value={classItem._id}>
                            {classItem.title}
                        </option>
                    ))}
                </select>

                {insight && (
                    <div className="class-insight-card fade-in">
                        <div
                            className="insight-content prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: insight }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default InsightsViewer;
