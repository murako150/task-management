import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProjectAdmin() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clients, setClients] = useState([]);  // クライアント一覧を保存するstate
  const [selectedClient, setSelectedClient] = useState('');  // 選択されたクライアントのID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:33001/api/clients', {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setClients(response.data);  // クライアント一覧を保存
        console.log(response.data); // クライアントデータを確認
      } catch (error) {
        console.error('クライアントの取得に失敗しました:', error);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(
        'http://localhost:33001/api/projects',
        {
          name,
          description,
          owner_id: selectedClient,  // 選択されたクライアントのIDを送信
        },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      console.log('プロジェクト作成成功:', response.data);
      navigate('/projects');  // プロジェクト一覧ページへリダイレクト
    } catch (error) {
      console.error('プロジェクトの作成に失敗しました:', error);
    }
  };

  return (
    <div>
      <h2>プロジェクトを追加（管理者）</h2>
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
        <div>
          <label>クライアントを選択:</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            required
          >
            <option value="">クライアントを選択</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">プロジェクトを追加</button>
      </form>
    </div>
  );
}

export default AddProjectAdmin;