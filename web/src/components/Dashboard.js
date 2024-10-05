import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // トークンを取得し、ヘッダーに設定
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.get('http://localhost:33001/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setTasks(response.data); // タスク一覧を設定
      })
      .catch(err => {
        setError('タスクの取得に失敗しました');
        console.error(err);
      });
    } else {
      setError('ログインが必要です');
    }
  }, []);

  return (
    <div>
      <h2>ダッシュボード</h2>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;