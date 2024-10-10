import React from 'react';
import CommentItem from './CommentItem';

function CommentList({ comments }) {
  return (
    <div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
}

export default CommentList;