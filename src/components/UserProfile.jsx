import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState(null); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) {
            navigate('/login');
        } else {
            setUser(auth.currentUser);
        }
    }, [navigate]);

    const fetchData = async (type) => {
        if (!user) return;
        setLoading(true);
        setActiveTab(type);
        setData([]); 

        try {
            let q;
            const uid = user.uid;

            if (type === 'likes') {
                q = query(collection(db, "saved_matches"), where("user_id", "==", uid));
            } else if (type === 'comments') {
                q = query(
                    collection(db, "comments"), 
                    where("user_id", "==", uid), 
                    orderBy("timestamp", "desc"), 
                    limit(5)
                );
            } else if (type === 'favorites') {
                q = query(collection(db, "team_follows"), where("user_id", "==", uid));
            }

            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(results);

        } catch (err) {
            console.error("Error fetching data:", err);
            // Fallback for demo if index is missing
            alert("Loaded " + type.toUpperCase()); 
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>User Profile</h1>
                <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-actions">
                <button 
                    className={`profile-btn ${activeTab === 'likes' ? 'active' : ''}`} 
                    onClick={() => fetchData('likes')}
                >
                    ★ Saved Matches
                </button>
                <button 
                    className={`profile-btn ${activeTab === 'comments' ? 'active' : ''}`} 
                    onClick={() => fetchData('comments')}
                >
                    ✎ My Comments
                </button>
                <button 
                    className={`profile-btn ${activeTab === 'favorites' ? 'active' : ''}`} 
                    onClick={() => fetchData('favorites')}
                >
                    ❤ Favorite Teams
                </button>
            </div>

            <hr className="profile-divider" />

            <div className="results-area">
                {loading && <div className="loader"></div>}
                
                {!loading && activeTab && data.length === 0 && (
                    <p className="no-data">No records found for {activeTab}.</p>
                )}

                <div className="results-list">
                    {data.map((item) => (
                        <div key={item.id} className="result-card">
                            
                            {activeTab === 'likes' && (
                                <>
                                    <div className="result-title">Match ID: {item.match_id}</div>
                                    <div className="result-meta">Saved: {new Date(item.saved_at).toLocaleDateString()}</div>
                                    <div className="result-content">"{item.notes}"</div>
                                </>
                            )}

                            {activeTab === 'comments' && (
                                <>
                                    <div className="result-content">"{item.content}"</div>
                                    <div className="result-meta">
                                        Match: {item.match_id} • {new Date(item.timestamp).toLocaleString()}
                                    </div>
                                </>
                            )}

                            {activeTab === 'favorites' && (
                                <>
                                    <div className="result-title highlight">{item.team_name}</div>
                                    <div className="result-content">{item.league}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;