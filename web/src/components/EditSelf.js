import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button } from '@mui/material';

function EditSelf() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:33001/api/user', {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        setError('ユーザー情報の取得に失敗しました。');
        console.error('ユーザー情報の取得エラー:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const updateData = {
        name,
        email,
      };
  
      if (password) {
        updateData.password = password;
      }
      const userId = user.id; 
      await axios.put(`http://localhost:33001/api/user/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
  
      setSuccess('プロフィールが更新されました。');
      setPassword('');
    } catch (error) {
      setError('プロフィールの更新に失敗しました。');
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
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="パスワード（変更する場合のみ）"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="新しいパスワードを入力"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          更新
        </Button>
      </form>
    </Container>
  );
}

export default EditSelf;