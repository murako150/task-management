import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(); // 初回のユーザー取得
  }, []);

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user);
      const response = await axios.get('http://localhost:33001/api/user_accounts', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      setError('ユーザー一覧の取得に失敗しました');
    }
  };

  const toggleActive = async (userId, currentStatus) => {
    const confirmAction = window.confirm(
      currentStatus
        ? 'このユーザーを無効にしますか？'
        : 'このユーザーを有効にしますか？'
    );
    if (!confirmAction) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.put(`http://localhost:33001/api/user/${userId}`, {
        active_flag: !currentStatus,
      }, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      fetchUsers(); // ユーザーリストを更新
    } catch (error) {
      setError('アクティブ状態の切り替えに失敗しました');
    }
  };

  const handleEdit = (userId) => {
    navigate(`/edit-profile/${userId}`);
  };

  const handleAddUser = () => {
    navigate('/add-user');  // ユーザー追加のナビゲーション
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        ユーザー管理
        <Button variant="contained" color="primary" onClick={handleAddUser} style={{ marginLeft: '20px' }}>
          ユーザー追加
        </Button>
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>名前</TableCell>
              <TableCell>メール</TableCell>
              <TableCell>ロール</TableCell>
              <TableCell>アクティブ状態</TableCell>
              <TableCell>アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} style={{ backgroundColor: user.active_flag ? '#ffffff' : '#f9f9f9' }}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.active_flag ? '有効' : '無効'}</TableCell>
                <TableCell>
                  {currentUser?.role === 'admin' && user.id !== 1 && (
                    <>
                      <Button onClick={() => toggleActive(user.id, user.active_flag)} color="primary">
                        {user.active_flag ? '無効にする' : '有効にする'}
                      </Button>
                      <Button onClick={() => handleEdit(user.id)} color="default">
                        プロフィール編集
                      </Button>
                    </>
                  )}
                  {currentUser?.id === user.id && (
                    <Button onClick={() => handleEdit(user.id)} color="default">
                      プロフィール編集
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default UserList;