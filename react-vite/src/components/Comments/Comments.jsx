import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import * as commentActions from '../../redux/comments'
import './Comments.scss';

function CommentsSection(recipeId) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user)
    const comments = useSelector((state) => state.comments.comments)
    const max = 1000;

    const [comment, setComment] = useState('')
    const [errors, setErrors] = useState({})

    useEffect(() => {
      dispatch(commentActions.getAllComments(recipeId.id))
    }, [dispatch,recipeId])

    useEffect(() => {
        
    },[comments])
    
    // console.log('comments', comments)

    const handleSubmit = async() => {
        const newComment = {
            'user_id': user.id,
            'recipe_id': recipeId.id,
            'comment': comment
        }

        if(Object.keys(errors).length > 0){
            return
        }

        const res = await dispatch(commentActions.addComment(newComment))

        if (res.errors) {
            setErrors(res.errors)
            return
        }
        setComment('')
        setErrors({})
    }

    const handleDelete = async(id) => {
        dispatch(commentActions.deleteComment(id))

    }






    return(
        <div className="comments-section">
            <label className="comments-label">Comments</label>
            <div className="add-comment">
                <textarea type="text" placeholder="Tried the recipe? Leave a comment" value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="comment-input"/>
                <div className="comment-submit">
                    <p>{ max - comment.length }</p>
                    <button type="submit" onClick={handleSubmit}>submit</button>
                </div>
            </div>
            {comments? comments.map((comment) => (
                <div key={comment.id} className="comments">
                    <div className="comment-info">
                        <p>{comment.username}</p>
                        <p>date_created</p>
                    </div>
                    {comment.comment}
                    <FaEdit/>
                    <FaTrashAlt onClick={handleDelete(comment.id)}/>
                </div>
            )):(
                <div></div>
            )}
        </div>
    )
}

export default CommentsSection;