// web/src/components/EditSelf.js

import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { apiService } from '../api';

const EditSelf = () => {
    const [userData, setUserData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserData({ name: user.name, email: user.email });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await apiService.put(`user/${user.user_id}`, userData);
            alert('プロフィールが更新されました。');
        } catch (error) {
            console.error('更新エラー:', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h5" gutterBottom>プロフィール編集</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="名前"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="新しいパスワード"
                    name="password"
                    type="password"
                    value={userData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit">
                    更新
                </Button>
            </form>
        </Container>
    );
};

export default EditSelf;