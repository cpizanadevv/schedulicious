const SET_TAG = "tag/setTag";
const SET_TAGS = "tags/setTags";
const SET_RECIPE_TAG = "tag/setRecipeTag";
const REMOVE_TAG = "tag/removeTag";

// * Actions
const setTag = (tag) => ({
  type: SET_TAG,
  payload: { tag },
});
const setTags = (tags) => ({
  type: SET_TAGS,
  payload: { tags },
});
const setRecipeTag = (tag) => ({
  type: SET_RECIPE_TAG,
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
      return data
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (error) {
    return { error: "An error occurred. Please try again later." };
  }
};

export const addRecipeTag = (recipeId,tagId) => async (dispatch) => {
  console.log('ADD RECIPE TAG', recipeId, tagId)
  const res = await fetch(`/api/tags/${recipeId}/${tagId}/add-recipe-tag`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }
  );
  if (res.ok) {
    const data = await res.json();
    dispatch(setRecipeTag(data));
    return data
  } else {
    const errors = await res.json();
    return errors;
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

export const getTags = (query) => async (dispatch) => {
  const res = await fetch(`/api/tags/all?query=${encodeURIComponent(query)}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(setTags(data));
  }
};

const initialState = { recipeTag: {}, tags: {} };

function tagReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TAG: {
      const { tag } = action.payload;
      return {
        ...state,
        tags: {
          ...state.tags,
          [tag.id]: tag,
        },
      };
    }
    case SET_TAGS: {
      const newState = { ...state, tags: {} };
      action.payload.tags.forEach((tag) => {
        newState.tags[tag.id] = tag;
      });
      return newState;
    }
    case SET_RECIPE_TAG:
      return {
        ...state,
        recipeTag: {
          ...state.recipeTag,
          ...action.payload,
        },
      };

    case REMOVE_TAG: {
      const newState = { ...state };
      delete newState.tags[action.payload.id];
      delete newState.recipeTag[action.payload.id];
      return newState;
    }
    default:
      return state;
  }
}

export default tagReducer;
