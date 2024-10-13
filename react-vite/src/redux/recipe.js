const SET_RECIPE = "recipe/setRecipe";
const REMOVE_RECIPE = "recipe/removeRecipe";
const SET_ALL_RECIPES = "recipes/setAllRecipes";
const ADD_FAV = "favorite/addFav";
const REMOVE_FAV = "favorite/removeFav";
const SET_FAVS ='favorites/setFavorites'

// * Actions
const setRecipe = (recipe) => ({
  type: SET_RECIPE,
  payload: recipe,
});

const setAllRecipes = (recipes) => ({
  type: SET_ALL_RECIPES,
  payload: recipes,
});

const setFavorites = (recipes) => ({
  type: SET_FAVS,
  payload: {recipes},
});

const removeRecipe = (recipe) => ({
  type: REMOVE_RECIPE,
  payload: recipe,
});

const addFav = (recipeId) => ({
  type: ADD_FAV,
  payload: recipeId,
});

const removeFav = (recipeId) => ({
  type: REMOVE_FAV,
  payload: recipeId,
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
  const res = await fetch(`/api/recipes/${recipeId}/delete`, {
    method: "DELETE"
  });

  if (res.ok) {
    const data = await res.json()
    dispatch(removeRecipe(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const addFavorite = (recipeId) => async (dispatch) => {
  const response = await fetch(`/api/recipes/${recipeId}/fav`, {
    method: "POST",
  });

  if (response.ok) {
    dispatch(addFav(recipeId));
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const removeFavorite = (recipeId) => async (dispatch) => {
  const res = await fetch(`/api/recipes/${recipeId}/remove-fav`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(removeFav(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const getUserFavs = () => async (dispatch) => {
  const res = await fetch("/api/recipes/all-favorites");

  if (res.ok) {
    const data = await res.json();
    dispatch(setFavorites(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};



export const getSingleRecipe = (id) => async (dispatch) => {
  const res = await fetch(`/api/recipes/${id}`)
  if (res.ok) {
    const data = await  res.json()
    dispatch(setRecipe(data))
    return data
  }else {
    const errors = await  res.json();
    return errors;
  }
}

export const updateRecipe = (recipe,recipeId) => async (dispatch) => {
  // recipe.forEach((value, key) => {
  //   console.log('THUNK')
  //   console.log(`${key}: ${value}`);
  // });
  const res = await fetch(`/api/recipes/update-recipe/${recipeId}`, {
    method: "PUT",
    body: recipe,
  })
  if (res.ok) {
    const data = await  res.json()
    dispatch(setRecipe(data))
    return data
  }else {
    const errors = await  res.json();
    return errors;
  }
}

// * State Reducer
const initialState = { recipe: {}, recipes: {}};

function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RECIPE: 
      return {
        ...state,...action.payload 
      };
    case SET_ALL_RECIPES: {
      // console.log("Payload received in reducer:", action.payload);
      const newState = { ...state, recipes: { ...state.recipes } };
      action.payload.recipes.forEach((recipe) => {
        newState.recipes[recipe.id] = recipe;
      });
      return newState;
    }
    case REMOVE_RECIPE: {
      const newState = { ...state };
      delete newState.recipes[action.payload.id];
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
            favorited: true,
          },
        }
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
            favorited: false,
          },
        }
      };
      return newState;
    }
    case SET_FAVS: {
      const newState = { ...state, recipes: { ...state.recipes } };
      action.payload.recipes.forEach((recipe) => {
        newState.recipes[recipe.id] = recipe;
      });
      return newState;
    }
    default:
      return state;
  }
}

export default recipeReducer;
