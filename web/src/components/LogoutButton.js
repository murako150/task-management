import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LogoutButton({ setUser }) { // setUser を受け取る
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (user && user.access_token) {
        // トークンを使ってログアウトAPIにリクエスト
        await axios.post('http://localhost:33001/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${user.access_token}`  // トークンをヘッダーに追加
          }
        });

        // ローカルストレージをクリアし、ユーザーステートをリセット
        localStorage.removeItem('user');
        setUser(null);

        // ログインページにリダイレクト
        navigate('/login');
      } else {
        throw new Error('トークンが存在しません。');
      }

    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  return <button onClick={handleLogout}>ログアウト</button>;
}

export default LogoutButton;