import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import { taskService } from '../../api'; // taskServiceをインポート

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const getTask = async () => {
    try {
      const taskData = await taskService.getTaskById(id);
      setTask(taskData);
    } catch (error) {
      console.error('タスク詳細取得エラー:', error);
    }
  };

  const getCommentsForTask = async () => {
    try {
      const commentsData = await taskService.getCommentsForTask(id);
      setComments(commentsData);
    } catch (error) {
      console.error('コメント取得エラー:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // ログインしているユーザーの情報を取得
      if (!user || !user.id) {
          throw new Error('ユーザーIDが取得できませんでした');
      }
      const commentData = {
          comment: newComment,
          user_id: user.id,  // user_idを追加
      };

      await taskService.addCommentToTask(id, commentData);
      setNewComment('');
      getCommentsForTask();
    } catch (error) {
      console.error('コメント追加エラー:', error);
    }
  };

  useEffect(() => {
    getTask();
    getCommentsForTask();
  }, [id]);

  if (!task) return <Typography>読み込み中...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>タスク詳細</Typography>
      <TextField label="タスク名" value={task.title} fullWidth disabled />
      <TextField label="期限" value={task.due_date} fullWidth disabled />
      <TextField label="ステータス" value={task.status} fullWidth select>
        <MenuItem value="pending">未完了</MenuItem>
        <MenuItem value="in_progress">進行中</MenuItem>
        <MenuItem value="completed">完了</MenuItem>
      </TextField>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>コメント一覧</Typography>
      {comments.map((comment, index) => (
        <Typography key={index} variant="body1">
          {comment.comment} - {new Date(comment.created_at).toLocaleString()}
        </Typography>
      ))}

      <TextField
        label="コメントを追加"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        style={{ marginTop: '20px' }}
      />
      <Button variant="contained" color="primary" onClick={handleCommentSubmit}>コメントを追加</Button>
    </Container>
  );
}
export default TaskDetails;