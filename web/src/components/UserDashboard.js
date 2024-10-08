import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [progressData, setProgressData] = useState({ pending: 0, in_progress: 0, completed: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', due_date: '', status: 'pending', assigned_user_id: '', project_id: '' });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [projects, setProjects] = useState([]); // プロジェクト情報
  const [users, setUsers] = useState([]); // ユーザー情報
  const [notification, setNotification] = useState('');

  // タスクの取得
  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get('http://localhost:33001/api/user/tasks', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setTasks(response.data);

      const progress = {
        pending: response.data.filter(task => task.status === 'pending').length,
        in_progress: response.data.filter(task => task.status === 'in_progress').length,
        completed: response.data.filter(task => task.status === 'completed').length,
      };
      setProgressData(progress);
    } catch (error) {
      console.error('タスク取得エラー:', error);
    }
  };

  // プロジェクトの取得
  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get('http://localhost:33001/api/projects', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('プロジェクト取得エラー:', error);
    }
  };

  // 特定のプロジェクトに関連するユーザーの取得
  const fetchUsers = async (projectId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:33001/api/projects/${projectId}/users`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setUsers(response.data); // プロジェクトに関連するユーザーのみを取得
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    }
  };

  // コメントを取得する関数
  const fetchComments = async (taskId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:33001/api/user/tasks/${taskId}/comments`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error('コメント取得エラー:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects(); // 初回レンダー時にプロジェクトを取得
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const chartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data: [progressData.pending, progressData.in_progress, progressData.completed],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const handleOpenModal = (task) => {
    if (task) {
      setSelectedTask(task);
      setModalOpen(true);
      setComment('');
      fetchComments(task.id);
    } else {
      setSelectedTask(null);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setComments([]);
  };

  const handleChangeNewTask = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
    if (e.target.name === 'project_id') {
      fetchUsers(e.target.value); // プロジェクト選択時に対応するユーザーを取得
    }
  };

  const handleAddTask = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userToken = user.access_token;
      const taskData = {
        ...newTask,
        assigned_to: newTask.assigned_user_id, // 修正: ユーザーIDをタスクに反映
      };

      await axios.post('http://localhost:33001/api/user/tasks', taskData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setNewTask({ title: '', due_date: '', status: 'pending', assigned_user_id: '', project_id: '' });
      handleCloseModal();
      fetchTasks();
      setNotification('タスクが追加されました！');
    } catch (error) {
      console.error('タスク追加エラー:', error);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.put(`http://localhost:33001/api/user/tasks/${selectedTask.id}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setSelectedTask(prev => ({ ...prev, status }));
      fetchTasks();
    } catch (error) {
      console.error('ステータス変更エラー:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post(`http://localhost:33001/api/user/tasks/${selectedTask.id}/comments`, 
        { 
          comment, 
          user_id: user.id  
        }, 
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      setComment('');
      fetchComments(selectedTask.id);
      setNotification('コメントが追加されました！');
    } catch (error) {
      console.error('コメント追加エラー:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container>
      {notification && (
        <Typography variant="body1" color="success.main" gutterBottom>
          {notification}
        </Typography>
      )}
      
      <Typography variant="h4" gutterBottom>ダッシュボード</Typography>
      
      <Typography variant="h6" gutterBottom>タスクの進捗状況</Typography>
      <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
        <Pie data={chartData} options={options} />
      </div>
      
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>タスク一覧</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenModal(null)}>新しいタスクを追加</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タスク名</TableCell>
              <TableCell>期限</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} onClick={() => handleOpenModal(task)}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.due_date}</TableCell>
                <TableCell>{task.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* モーダル */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '20%', maxWidth: 400 }}>
          {selectedTask ? (
            <>
              <Typography variant="h6" gutterBottom>タスク詳細</Typography>
              <Typography>タスク名: {selectedTask.title}</Typography>
              <Typography>期限: {selectedTask.due_date}</Typography>
              <Typography>ステータス: {selectedTask.status}</Typography>
              
              {/* ステータス変更ドロップダウン */}
              <TextField
                select
                label="ステータスを変更"
                value={selectedTask.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="pending">未完了</MenuItem>
                <MenuItem value="in_progress">進行中</MenuItem>
                <MenuItem value="completed">完了</MenuItem>
              </TextField>
              
              {/* コメント入力 */}
              <TextField
                label="コメント"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
              <Button variant="contained" color="primary" onClick={handleCommentSubmit}>コメントを追加</Button>

              {/* コメントリスト表示 */}
              <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>コメント一覧</Typography>
              {comments.map((com, index) => (
                <Typography key={index} variant="body1">
                  {com.comment} - {new Date(com.created_at).toLocaleString()} {/* コメントの作成日時を表示 */}
                </Typography>
              ))}
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>新しいタスクを追加</Typography>
              <TextField label="タスク名" name="title" value={newTask.title} onChange={handleChangeNewTask} fullWidth />
              <TextField label="期限" name="due_date" type="date" value={newTask.due_date} onChange={handleChangeNewTask} fullWidth InputLabelProps={{ shrink: true }} />

              {/* プロジェクトの選択 */}
              <TextField
                select
                label="プロジェクト"
                name="project_id"
                value={newTask.project_id}
                onChange={handleChangeNewTask}
                fullWidth
                required
              >
                <MenuItem value=""><em>プロジェクトを選択</em></MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* 割り当てるユーザーの選択 */}
              <TextField
                select
                label="担当者"
                name="assigned_user_id"
                value={newTask.assigned_user_id}
                onChange={handleChangeNewTask}
                fullWidth
                required
              >
                <MenuItem value=""><em>ユーザーを選択</em></MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </TextField>

              <Button variant="contained" color="primary" onClick={handleAddTask}>追加</Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default UserDashboard;