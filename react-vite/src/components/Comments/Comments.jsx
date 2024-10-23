import { useSelector } from "react-redux";

function CommentsSection(recipeId) {
    comments = useSelector((state) => state.comments.comments)

    return(
        <div>

        </div>
    )
}

export default CommentsSection;