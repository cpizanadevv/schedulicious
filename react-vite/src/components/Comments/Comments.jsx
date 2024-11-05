import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import * as commentActions from "../../redux/comments";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteComment from "../Deletes/DeleteComment";
import "./Comments.scss";

function CommentsSection(recipeId) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const comments = useSelector((state) => state.comments.comments);
  const pages = useSelector((state) => state.comments.pages);
  const currDayChange = useRef(null);

  const max = 1000;
  const perPage = 10;

  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [currPg, setCurrPg] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(commentActions.getAllComments(recipeId.id, currPg, perPage));
  }, [dispatch, currPg, recipeId.id]);

  useEffect(() => {
    if (comments && comments.length > 0) {
      setLoading(false);
    }
  }, [comments]);

  
  const handleNextPage = () => {
    if (currPg < pages) setCurrPg((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currPg > 1) setCurrPg((prevPage) => prevPage - 1);
  };

  const handleSubmit = async () => {
    const newComment = {
      user_id: user.id,
      recipe_id: recipeId.id,
      comment: comment,
    };

    if (comment.length > max || comment.length < 1) {
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
    if (editComment.length > max || editComment.length < 1) {
      setErrors({
        editComment: "Comments can only be between 1 and 1000 characters",
      });
      return;
    }

    const res = await dispatch(
      commentActions.editComment(commentId, editedComment)
    );
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
        <div className="comment-submit-err">
          <div className="error-container">
            {errors.comment && <p className="errors">{errors.comment}</p>}
          </div>
          <div className="comment-submit">
            <p>{max - comment.length}</p>
            <button onClick={handleSubmit} ref={currDayChange}>
              Submit
            </button>
          </div>
        </div>
      </div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={`comment-${comment.id}`} className="comments">
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
                <div className="comment-submit-err">
                  <div className=".error-container">
                    {errors.editComment && (
                      <p className="errors">{errors.editComment}</p>
                    )}
                  </div>
                  <div className="comment-submit">
                    <p>{max - editComment.length}</p>
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="edit-submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="comment">{comment.comment}</p>
                {user && user.username == comment.username && (
                  <div>
                    <div className="comment-buttons">
                      <div className="recipe-button">
                        <span className="tooltiptext">Edit Comment</span>
                        <FaEdit
                          className="update"
                          onClick={() => handleEditClick(comment)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <div className="recipe-button">
                        <span className="tooltiptext">Delete Recipe</span>
                        <OpenModalButton
                          buttonText={<FaTrashAlt className="delete" />}
                          modalComponent={<DeleteComment id={comment.id} />}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* <FaReply /> */}
          </div>
        ))
      ) : (
        <div>
          <p>There are no comments on this recipe. Be the first!</p>
        </div>
      )}
      {comments.length > 0 && (
      <div className="pagination">
        <button disabled={currPg === 1} onClick={handlePrevPage}>
          Previous
        </button>
        <span>
          Page {currPg} of {pages}
        </span>
        <button disabled={currPg === pages} onClick={handleNextPage}>
          Next
        </button>
      </div>

      )}
      {/* <div>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? "active" : "pages"}
          >
            {i + 1}
          </button>
        ))}
      </div> */}
    </div>
  );
}

export default CommentsSection;