import React from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function AdminDashboard({ tasks, users, projects }) {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>管理者ダッシュボード</Typography>

      {/* タスク一覧 */}
      <Typography variant="h6" gutterBottom>タスク一覧</Typography>
      <Button variant="contained" color="primary" component={Link} to="/tasks/create">タスクを追加</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タスク名</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>期限</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.due_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ユーザー一覧 */}
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>ユーザー一覧</Typography>
      <Button variant="contained" color="primary" component={Link} to="/users/create">ユーザーを追加</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ユーザーID</TableCell>
              <TableCell>名前</TableCell>
              <TableCell>ロール</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* プロジェクト一覧 */}
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>プロジェクト一覧</Typography>
      <Button variant="contained" color="primary" component={Link} to="/projects/create">プロジェクトを追加</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>プロジェクト名</TableCell>
              <TableCell>説明</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map(project => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminDashboard;