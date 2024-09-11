const SET_RECIPE = "recipe/setRecipe";
const REMOVE_RECIPE = "recipe/removeRecipe";
const SET_ALL_RECIPES = "recipes/setAllRecipes";

// * Actions
const setRecipe = (recipe) => ({
  type: SET_RECIPE,
  payload: recipe,
});

const setAllRecipes = (recipes) => ({
  type: SET_ALL_RECIPES,
  payload: recipes,
});

const removeRecipe = (recipeId) => ({
  type: REMOVE_RECIPE,
  payload: recipeId,
});

//* Thunks

export const getAllRecipes = () => async (dispatch) => {
  const res = await fetch("api/recipes/all-recipes");
  if (res.ok) {
    const data = await res.json();
    dispatch(setAllRecipes(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const addRecipe = (recipe) => async (dispatch) => {
  console.log("THIS IS RECIPE IN THUNK", recipe)
  const res = await fetch("/api/recipes/new-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setRecipe(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createImage = (post) => async (dispatch) => {
  const response = await fetch(`api/img/`, {
    method: "POST",
  //   headers: {
  //     'Accept': 'application/json',
  //     "Content-Type": "application/json",
  //   },
    body: post
  });

  if (response.ok) {
      const { resPost } = await response.json();
      dispatch(addPost(resPost));
  } else {
      console.log("There was an error making your post!")
  }
};

export const deleteRecipe = (recipeId) => async (dispatch) => {
  const res = await fetch(`/api/recipes/${recipeId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    dispatch(removeRecipe(recipeId));
  } else {
    const errors = await res.json();
    return errors;
  }
};

// * State Reducer
const initialState = { recipe: {}, recipes: {} };

function recipeReducer(state = initialState, action) {
    switch (action.type) {
      case SET_RECIPE: {
        return {
          ...state,
          recipes: { ...state.recipes, [action.payload.recipe.id]: action.payload.recipe },
          recipe: action.payload.recipe,
        };
      }
      case SET_ALL_RECIPES: {
        const newState = { ...state, recipes: {} };
        action.payload.recipes.forEach((recipe) => {
          newState.recipes[recipe.id] = recipe;
        });
        return newState;
      }
      case REMOVE_RECIPE: {
        const newState = { ...state };
        delete newState.recipes[action.payload.recipeId];
        return newState;
      }
      default:
        return state;
    }
  }

export default recipeReducer;
