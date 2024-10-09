// web/src/components/Login.js

import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api'; 

const Login = () => {
    const [userId, setUserId] = useState(''); // user_idを使用
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // apiServiceのloginメソッドを使用してログイン
            const response = await apiService.login(userId, password);
            localStorage.setItem('user', JSON.stringify(response)); // ユーザー情報をローカルストレージに保存
    
            // ユーザーの役割に応じてダッシュボードへ遷移
            if (response.role === 'admin') {
                navigate('/admin-dashboard'); // 管理者ダッシュボードへ遷移
            } else if (response.role === 'client') {
                navigate('/client-dashboard'); // クライアントダッシュボードへ遷移
            } else {
                navigate('/user-dashboard'); // 一般ユーザーダッシュボードへ遷移
            }
        } catch (err) {
            setError('ログインに失敗しました。');
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h5" gutterBottom>ログイン</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                label="User ID" // ユーザーIDフィールド
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                ログイン
            </Button>
        </Container>
    );
};

export default Login;