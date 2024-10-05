import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, Button } from '@mui/material';

function Login({ setUser }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.get('http://localhost:33001/sanctum/csrf-cookie');
      const response = await axios.post('http://localhost:33001/api/login', {
        user_id: userId,
        password: password,
      });

      const userData = {
        id: response.data.id,
        user_id: response.data.user_id,
        name: response.data.name,
        role: response.data.role,
        access_token: response.data.access_token,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      if (response.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (response.data.role === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/user-dashboard');
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(`ログインエラー: ${err.response.data.message}`);
      } else {
        setError('ログインに失敗しました。');
      }
      console.error(err);
    }
  };

  return (
    <Grid container style={{ height: '100vh' }} justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={6} md={4}>
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h5" component="h2">ログイン</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="ユーザーID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <TextField
              label="パスワード"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              ログイン
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;