import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as commentActions from '../../redux/comments'

function CommentsSection(recipeId) {
    const dispatch = useDispatch();
    comments = useSelector((state) => state.comments)

    useEffect(() => {
      dispatch(commentActions.getAllComments(recipeId))
    }, [dispatch])
    


    return(
        <div className="comments-section">
            <input type="text" />
            {comments.length > 0 && (
                <div>

                </div>
            )}
        </div>
    )
}

export default CommentsSection;