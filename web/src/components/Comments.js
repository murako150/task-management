// src/components/Comments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Comments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // タスクに関連するコメントを取得
    axios.get(`http://localhost:33001/api/tasks/${taskId}/comments`)
      .then(response => setComments(response.data))
      .catch(error => console.error(error));
  }, [taskId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios.post(`http://localhost:33001/api/tasks/${taskId}/comments`, {
      comment: newComment,
      user_id: 1,  // 実際のログインユーザーIDを使うことを推奨
    })
    .then(response => {
      setComments([...comments, response.data]);
      setNewComment('');
    })
    .catch(error => setError('コメントの追加に失敗しました'));
  };

  return (
    <div>
      <h3>コメント</h3>
      {comments.map(comment => (
        <div key={comment.id}>{comment.comment}</div>
      ))}

      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="新しいコメント"
        />
        {error && <p>{error}</p>}
        <button type="submit">コメントを追加</button>
      </form>
    </div>
  );
}

export default Comments;