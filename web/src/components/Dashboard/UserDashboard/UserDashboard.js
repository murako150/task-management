import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Modal, Box, TextField, MenuItem
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function UserDashboard({
  tasks,
  progressData,
  modalOpen,
  selectedTask,
  newTask,
  comment,
  comments,
  projects,
  users,
  handleOpenModal,
  handleCloseModal,
  handleChangeNewTask,
  handleAddTask,
  handleStatusChange,
  handleCommentSubmit,
  handleTaskClick
}) {
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

  return (
    <Container>
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
              <TableCell>プロジェクト名</TableCell>
              <TableCell>期限</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} onClick={() => handleTaskClick(task)}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.project_name}</TableCell>
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
                value={newTask.comment}
                onChange={(e) => handleChangeNewTask(e.target.value, 'comment')}
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
              <TextField label="タスク名" name="title" value={newTask.title} onChange={(e) => handleChangeNewTask(e.target.value, 'title')} fullWidth />
              <TextField label="期限" name="due_date" type="date" value={newTask.due_date} onChange={(e) => handleChangeNewTask(e.target.value, 'due_date')} fullWidth InputLabelProps={{ shrink: true }} />
              
              {/* プロジェクトの選択 */}
              <TextField
                select
                label="プロジェクト"
                name="project_id"
                value={newTask.project_id}
                onChange={(e) => handleChangeNewTask(e.target.value, 'project_id')}
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

              {/* 担当者の選択 */}
              <TextField
                select
                label="担当者"
                name="assigned_user_id"
                value={newTask.assigned_user_id}
                onChange={(e) => handleChangeNewTask(e.target.value, 'assigned_user_id')}
                fullWidth
                required
              >
                <MenuItem value=""><em>担当者を選択</em></MenuItem>
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