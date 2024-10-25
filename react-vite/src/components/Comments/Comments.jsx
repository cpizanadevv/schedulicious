import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrashAlt, FaEdit,FaReply } from "react-icons/fa";
import * as commentActions from "../../redux/comments";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteComment from "../Deletes/DeleteComment";
import "./Comments.scss";

function CommentsSection(recipeId) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const comments = useSelector((state) => state.comments.comments);
  const max = 1000;

  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    dispatch(commentActions.getAllComments(recipeId.id));
  }, [dispatch, recipeId]);

  useEffect(() => {}, [comments]);

  // console.log('comments', comments)

  const handleSubmit = async () => {
    const newComment = {
      user_id: user.id,
      recipe_id: recipeId.id,
      comment: comment,
    };

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (comment.length > max) {
      setErrors({
        comment: "Comments can only be between 1 and 1000 characters",
      });
      return;
    }

    const res = await dispatch(commentActions.addComment(newComment));

    if (res) {
      setErrors(res.errors);
      return;
    } else {
      setComment("");
      setErrors({});
    }
  };

  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditComment(comment.comment);
  };

  const handleSaveEdit = async (commentId) => {
    const editedComment = {
      user_id: user.id,
      recipe_id: recipeId.id,
      comment: editComment,
    };
    if (editComment.length > max) {
        setErrors({
          editComment: "Comments can only be between 1 and 1000 characters",
        });
        return;
      }

    const res = await dispatch(commentActions.editComment(commentId,editedComment));
    if (res) {
      setErrors(res);
    } else {
      setEditCommentId(null);
      setEditComment("");
    }
  };

  return (
    <div className="comments-section">
      <label className="comments-label">Comments</label>
      <div className="add-comment">
        <textarea
          type="text"
          placeholder="Tried the recipe? Leave a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="comment-input"
        />
        {errors.comment && <p className="errors">{errors.comment}</p>}
        <div className="comment-submit">
          <p>{max - comment.length}</p>
          <button type="submit" onClick={handleSubmit}>
            submit
          </button>
        </div>
      </div>
      {comments ? (
        comments.map((comment) => (
          <div key={comment.id} className="comments">
            <div className="comment-info">
              <p>{comment.username}</p>
              <p>date_created</p>
            </div>
            {editCommentId === comment.id ? (
              <div>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="edit-input"
                />
                <div>
                <p>{max - editComment.length}</p>
                <button
                  onClick={() => handleSaveEdit(comment.id)}
                  className="edit-submit"
                >
                  Submit
                </button>
                {errors.editComment && <p className="errors">{errors.editComment}</p>}
                </div>
              </div>
            ) : (
              <div>
                <p>{comment.comment}</p>
                <FaEdit
                  onClick={() => handleEditClick(comment)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            )}
            <FaReply />
            <div className="recipe-button">
              <span className="tooltiptext">Delete Recipe</span>
              <OpenModalButton
                buttonText={<FaTrashAlt />}
                modalComponent={<DeleteComment id={comment.id} />}
              />
            </div>
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default CommentsSection;
