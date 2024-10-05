// src/components/AddProjectClient.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProjectClient() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.access_token) {
      setError('ログインユーザーの情報が見つかりません');
      return;
    }

    try {
      const response = await axios.post('http://localhost:33001/api/projects', {
        name,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      // プロジェクト作成後にプロジェクトリストへ移動
      navigate('/projects');
    } catch (error) {
      setError('プロジェクトの作成に失敗しました。');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>プロジェクトを追加</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>プロジェクト名:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>説明:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">追加</button>
      </form>
    </div>
  );
}

export default AddProjectClient;