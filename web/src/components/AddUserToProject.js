import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function AddUserToProject() {
  const { projectId } = useParams();
  const [userId, setUserId] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAvailableUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:33001/api/projects/${projectId}/available-users`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    }
  };

  useEffect(() => {
    fetchAvailableUsers();
  }, [projectId]);

  const handleAddUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(`http://localhost:33001/api/projects/${projectId}/add-user`, {
        user_id: userId,
        user_account_id: userId, // ここでuserAccountIdを含める
      }, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setMessage(response.data.message);
      setUserId('');
    } catch (error) {
      setMessage('ユーザーの追加に失敗しました。');
      console.error('ユーザー追加エラー:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>プロジェクトにユーザーを追加</Typography>
      
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id="user-select-label">ユーザーを選択</InputLabel>
        <Select
          labelId="user-select-label"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          {availableUsers.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} ({user.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>



      <Button variant="contained" color="primary" onClick={handleAddUser}>
        ユーザーを追加
      </Button>
      {message && <Typography style={{ marginTop: '20px' }}>{message}</Typography>}
    </Container>
  );
}

export default AddUserToProject;