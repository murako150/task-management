import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentList({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // ログインユーザーの情報を取得
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
console.log(loggedInUser)
  // コメント一覧を取得
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:33001/api/tasks/${taskId}/comments`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        console.log('取得したコメントデータ:', response.data);  // デバッグ用
        setComments(response.data);
      } catch (error) {
        console.error('コメントの取得に失敗しました:', error);
        setError('コメントの取得に失敗しました。');
      }
    };

    fetchComments();
  }, [taskId]);

  // コメントを追加
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('コメントを入力してください。');
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(`http://localhost:33001/api/tasks/${taskId}/comments`, {
        comment: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      setComments([...comments, response.data]);
      setNewComment(''); // コメントの追加に成功したら入力欄をクリア
      setError('');
    } catch (error) {
      console.error('コメントの追加に失敗しました:', error);
      setError('コメントの追加に失敗しました。');
    }
  };

  // 編集ボタンを押すと編集モードに
  const handleEditComment = (comment) => {
    if (comment.user && loggedInUser && comment.user.id === loggedInUser.id) {
      setEditingCommentId(comment.id);
      setEditingContent(comment.comment);
    }
  };

  // コメントの更新
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editingContent.trim()) {
      setError('コメント内容を入力してください。');
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.put(`http://localhost:33001/api/comments/${editingCommentId}`, {
        comment: editingContent,
      }, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      setComments(comments.map(comment => 
        comment.id === editingCommentId ? { ...comment, comment: editingContent } : comment
      ));

      setEditingCommentId(null);
      setEditingContent('');
      setError('');
    } catch (error) {
      console.error('コメントの更新に失敗しました:', error);
      setError('コメントの更新に失敗しました。');
    }
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
    setError('');
  };

  return (
    <div>
      <h3>コメント</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id}>
              {editingCommentId === comment.id ? (
                <form onSubmit={handleUpdateComment}>
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button type="submit">更新</button>
                  <button type="button" onClick={handleCancelEdit}>キャンセル</button>
                </form>
              ) : (
                <>
                  <strong>{comment.user?.name}</strong>: {comment.comment}
                  {comment.user && loggedInUser && comment.user.id === loggedInUser.id && (
                    <button onClick={() => handleEditComment(comment)}>編集</button>
                  )}
                </>
              )}
            </li>
          ))
        ) : (
          <p>コメントがありません。</p>
        )}
      </ul>

      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="コメントを入力..."
        />
        <button type="submit">コメントを追加</button>
      </form>
    </div>
  );
}

export default CommentList;