const SET_RECIPE = 'recipe/setRecipe';
const REMOVE_RECIPE = 'recipe/removeRecipe';
const SET_ALL_RECIPES = 'recipe/setAllRecipes';

// * Actions
const setRecipe = (recipe) => ({
    type: SET_RECIPE,
    recipe
})

const setALlRecipes = (recipes) => ({
    type: SET_ALL_RECIPES,
    recipes
})

const removeRecipe = (recipe) => ({
    type: REMOVE_RECIPE,
    recipe
})

//* Thunks

export const getAllRecipes = () => (dispatch)

// * State Reducer
const initialState = { recipe:{},recipes:{} };

function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RECIPE:
      return { ...state, recipe: action.payload };
    case SET_ALL_RECIPES:
      return { ...state, recipes: action.payload };
    case REMOVE_RECIPE:
      return { ...state, recipe: null };
    default:
      return state;
  }
}

export default recipeReducer;
