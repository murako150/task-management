import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, FormControl, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

function AddUser() {
  const [formData, setFormData] = useState({
    user_id: '',  
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roles, setRoles] = useState(['user']);
  const [loading, setLoading] = useState(false); // ローディング状態
  const navigate = useNavigate(); // useNavigateをフックとして呼び出す

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.role === 'admin') {
      setRoles(['admin', 'client', 'user']);
    } else if (user.role === 'client') {
      setRoles(['user']);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ローディング開始
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('http://localhost:33001/api/user_accounts', formData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setSuccess('ユーザーが追加されました');
      setError('');
      setFormData({ user_id: '', name: '', email: '', password: '', role: 'user' }); // フォームリセット

      // ユーザー追加後にユーザー一覧にリダイレクト
      navigate('/users'); // ユーザー一覧にリダイレクト
    } catch (error) {
      setError(error.response?.data?.message || 'ユーザーの追加に失敗しました'); // エラーメッセージを具体化
      setSuccess('');
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        新しいユーザーを追加
      </Typography>
      {success && <Typography color="primary">{success}</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="ユーザーID"
          name="user_id"
          value={formData.user_id}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="名前"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="メール"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="パスワード"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <Select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            {roles.map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'ユーザーを追加'}
        </Button>
      </form>
    </Container>
  );
}

export default AddUser;