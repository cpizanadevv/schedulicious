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

export const getAllRecipes = (page, perPage,query='') => async (dispatch) => {
  const queryStr = query ? `&query=${query}`:'';
  const res = await fetch(
    `/api/recipes/all-recipes?page=${page}&per_page=${perPage}${queryStr}`
  );
  if (res.ok) {
    const data = await res.json();
    dispatch(setAllRecipes(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const loadAllRecipes = (page, perPage,query='') => async () => {
  const queryStr = query ? `&query=${query}`:'';
  const res = await fetch(
    `/api/recipes/all-recipes?page=${page}&per_page=${perPage}${queryStr}`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
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
const initialState = { recipe: {}, recipes: [], favorited:[]};

function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RECIPE: 
      const newState =  { ...state, recipe: {} };
      newState.recipe = {
        ...action.payload
      }
      return newState;
      case SET_ALL_RECIPES:
        return {
          ...state,
          recipes:action.payload.recipes ,
          total: action.payload.total,
          pages: action.payload.pages,
          current_page: action.payload.current_page,
          has_more: action.payload.has_more,
        };
    case REMOVE_RECIPE: {
      const newState = { ...state };
      delete newState.recipes[action.payload.id];
      return newState;
    }
    case "ADD_FAVORITE": {
      const recipeId = action.payload;
      const newState = {
        ...state,
        recipes: {
          ...state.recipes,
          [recipeId]: {
            ...state.recipes[recipeId],
            favorited: true,
          },
        },
      };
      return newState;
    }
    case "REMOVE_FAVORITE": {
      const recipeId = action.payload;
      const newState = {
        ...state,
        recipes: {
          ...state.recipes,
          [recipeId]: {
            ...state.recipes[recipeId],
            favorited: false,
          },
        },
      };
      return newState;
    }
    case SET_FAVS: 
    return{
      ...state,
          favorited:action.payload.recipes
    }
    default:
      return state;
  }
}

export default recipeReducer;
