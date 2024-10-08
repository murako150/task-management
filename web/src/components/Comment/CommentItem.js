import React from 'react';

function CommentItem({ comment }) {
  return (
    <div>
      <p>{comment.comment}</p>
      <small>Posted by: {comment.user.name}</small>
      <small> at {new Date(comment.created_at).toLocaleString()}</small>
    </div>
  );
}

export default CommentItem;