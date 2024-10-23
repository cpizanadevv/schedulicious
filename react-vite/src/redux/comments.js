const SET_COMMENTS = 'comments/setComments'
const REMOVE_COMMENT = 'comment/removeComment'

const setComments = (comments) => ({
    type: SET_COMMENTS,
    payload: comments
})

const removeComment = (commentId) => ({
    type: REMOVE_COMMENTS,
    payload: commentId
})

export const getAllComments = (recipeId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${recipeId}/comments`)

    if(res.ok){
        const data = res.json()
        dispatch(setComments(data))
    }else {
        return res.json()
    }

}

export const addComment = (recipeId,comment) => async (dispatch) => {
    const res = await fetch(`/api/comments/${recipeId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comment),
        })

    if(res.ok){
        const data = res.json()
        dispatch(setComments(data))
    }else {
        return res.json()
    }

}

export const replyToComment = (recipeId,comment) => async (dispatch) => {
    const res = await fetch(`/api/comments/${recipeId}/${comment.id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comment),
        })

    if(res.ok){
        const data = res.json()
        dispatch(setComments(data))
    }else {
        return res.json()
    }

}

export const editComment = (comment) => async (dispatch) => {
    const res = await fetch(`/api/comments/${comment.id}/edit-comment`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comment),
        })

    if(res.ok){
        const data = res.json()
        dispatch(setComments(data))
    }else {
        return res.json()
    }

}

export const deleteComment = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}/delete-comment`,
        { method: "DELETE" })

    if(res.ok){
        const data = res.json()
        dispatch(removeComment(data))
    }else {
        return res.json()
    }

}

const initialState = { comments:{} }
function commentReducer(state=initialState, action){
    switch (action.type) {
        case SET_COMMENTS:
            return {
                ...state,
                comments: action.payload
            }
        case REMOVE_COMMENT:
            return {
                ...state,
                comments: state.comments.filter(comment => comment.id !== action.payload)
            }
        default:
            return state;
    }
}