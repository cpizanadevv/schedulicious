const SET_RECIPE = "recipe/setRecipe";
const REMOVE_RECIPE = "recipe/removeRecipe";
const SET_ALL_RECIPES = "recipes/setAllRecipes";
const ADD_FAV = "favorite/addFav";
const REMOVE_FAV = "favorite/removeFav";
const SET_FAVS = "favorites/setFavs";

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

const addFav = (recipeId) => ({
  type: ADD_FAV,
  recipeId,
});

const removeFav = (recipeId) => ({
  type: REMOVE_FAV,
  recipeId,
});

const setFavs = (favs) => ({
  type: REMOVE_FAV,
  payload: favs,
});

//* Thunks

export const getAllRecipes = () => async (dispatch) => {
  const res = await fetch("/api/recipes/all-recipes");
  if (res.ok) {
    const data = await res.json();
    dispatch(setAllRecipes(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const addRecipe = (recipe) => async (dispatch) => {
  const res = await fetch("/api/recipes/new-recipe", {
    method: "POST",
    body: recipe,
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setRecipe(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
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

export const addFavoriteThunk = (recipeId) => async (dispatch) => {
  const response = await fetch(`/api/recipes/${recipeId}/fav`, {
    method: "POST",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addFav(data.recipe_id));
    return data;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const removeFavoriteThunk = (recipeId) => async (dispatch) => {
  const res = await fetch(`/api/recipes/${recipeId}/remove-fav`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(removeFav(recipeId));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const getAllFavs = () => async (dispatch) => {
  const res = await fetch("`api/recipes/all-favorites");

  if (res.ok) {
    const data = await res.json();
    dispatch(setFavs(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

// * State Reducer
const initialState = { recipe: {}, recipes: {}, favorites: {} };

function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RECIPE: {
      return {
        ...state,
        recipe: {
          ...state.recipe,
          [action.payload.id]: { ...action.payload },
        },
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
    case "ADD_FAVORITE": {
      const { recipeId } = action;
      const newState = {
        ...state,
        recipes: {
          ...state.recipes,
          [recipeId]: {
            ...state.recipes[recipeId],
            is_favorited: true,
          },
        },
        favorites: {
          ...state.favorites,
          [recipeId]: true,
        },
      };
      return newState;
    }
    case "REMOVE_FAVORITE": {
      const { recipeId } = action;
      const newState = {
        ...state,
        recipes: {
          ...state.recipes,
          [recipeId]: {
            ...state.recipes[recipeId],
            is_favorited: false,
          },
        },
        favorites: {
          ...state.favorites,
          [recipeId]: false,
        },
      };
      return newState;
    }
    case "SET_FAVS": {
      const favRecipes = action.payload;
      const newState = {
        ...state,
        favorites: { ...state.favorites },
      };

      favRecipes.forEach((recipe) => {
        if (newState.recipes[recipe.id]) {
          newState.recipes[recipe.id].is_favorited = true;
        }
        newState.favorites[recipe.id] = true;
      });

      return newState;
    }

    default:
      return state;
  }
}

export default recipeReducer;
