import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.access_token) {
          throw new Error('ログインユーザーの情報が見つかりません');
        }

        const response = await axios.get('http://localhost:33001/api/tasks', {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        console.log('タスク取得成功:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('タスクの取得に失敗しました:', error.response ? error.response.data : error.message);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        タスク一覧
      </Typography>
      <Link to="/tasks/add">
          <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>
          タスクを追加
        </Button>
      </Link>
      <List>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <ListItem key={task.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
              <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {task.title}
              </Link>
            </ListItem>
          ))
        ) : (
          <Typography>タスクがありません。</Typography>
        )}
      </List>

    </Container>
  );
}

export default TaskList;