import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, FormControl, Select, MenuItem } from '@mui/material';

function EditProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    active_flag: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:33001/api/user_accounts/${userId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        setError('ユーザー情報の取得に失敗しました');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.put(`http://localhost:33001/api/user/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setSuccess('ユーザー情報が更新されました');
      setError('');
    } catch (error) {
      setError('ユーザー情報の更新に失敗しました');
    }
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        プロフィール編集
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="名前"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="メール"
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="パスワードを変更する場合のみ入力"
          type="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
          placeholder="パスワードを変更する場合のみ入力"
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <Select
            name="active_flag"
            value={userData.active_flag}
            onChange={handleInputChange}
          >
            <MenuItem value={true}>有効</MenuItem>
            <MenuItem value={false}>無効</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          更新
        </Button>
      </form>
    </Container>
  );
}

export default EditProfile;