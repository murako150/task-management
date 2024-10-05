import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import CommentList from './CommentList';  // コメントコンポーネントをインポート

function TaskDetails() {
  const { id } = useParams();  // URLパラメータからタスクIDを取得
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:33001/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`, // 認証トークンを付与
          },
        });
        setTask(response.data);  // タスク詳細をステートに保存
      } catch (error) {
        console.error('タスクの取得に失敗しました:', error);
        setError('タスクの取得に失敗しました');
      }
    };

    fetchTaskDetails();
  }, [id]);

  return (
    <Container style={{ padding: '20px' }}>
      {error && <Typography color="error">{error}</Typography>}
      {task ? (
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h5">{task.title}</Typography>
          <Typography variant="body1">{task.description}</Typography>
          <Typography variant="body2">ステータス: {task.status}</Typography>
          <Typography variant="body2">期限日: {task.due_date}</Typography>

          {/* コメントリストを表示 */}
          <CommentList taskId={id} />
        </Paper>
      ) : (
        <Typography>タスクの詳細を読み込んでいます...</Typography>
      )}
    </Container>
  );
}

export default TaskDetails;