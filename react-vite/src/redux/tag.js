const SET_TAG = "tag/setTag";
const REMOVE_TAG = "tag/removeTag";

// * Actions
const setTag = (tag) => ({
  type: SET_TAG,
  payload: tag,
});

const removeTag = (id) => ({
  type: REMOVE_TAG,
  payload: id,
});

//* Thunks

export const addTag = (tag) => async (dispatch) => {
  try {
    const res = await fetch("/api/tags/add-tag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tag),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(setTag(data));
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (error) {
    return { error: "An error occurred. Please try again later." };
  }
};

export const addRecipeTag = (recipeId, tagId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/tags/${recipeId}/${tagId}/add-recipe-tag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tag),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(setTag(data));
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (error) {
    return { error: "An error occurred. Please try again later." };
  }
};

export const deleteRecipeTag = (recipeTag) => async (dispatch) => {
  try {
    const res = await fetch(
      `/api/tags/${recipeTag.recipeId}/${recipeTag.tagId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      const data = await res.json();
      dispatch(removeTag(recipeTag.id));

      if (data.tagDeleted) {
        dispatch(removeTag(recipeTag.tagId));
      }
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (error) {
    return { error: "An error occurred. Please try again later." };
  }
};

const initialState = { recipeTag: {}, tag: {} };

function tagReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TAG:
      return {
        ...state,
        recipeTag: {
          ...state.tag,
          [action.payload.tag.id]: action.payload.tag,
        },
      };

    case REMOVE_TAG:
      const newState = { ...state };
      delete newState.tag[action.payload.id];
      delete newState.recipe_tag[action.payload.id];
      return newState;

    default:
      return state;
  }
}

export default tagReducer;
