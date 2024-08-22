const SET_RECIPE = 'recipe/setRecipe';
const REMOVE_RECIPE = 'recipe/removeRecipe';
const SET_ALL_RECIPES = 'recipe/setAllRecipes';

// * Actions
const setRecipe = (recipe) => ({
    type: SET_RECIPE,
    recipe
})

const setAllRecipes = (recipes) => ({
    type: SET_ALL_RECIPES,
    recipes
})

const removeRecipe = (recipe) => ({
    type: REMOVE_RECIPE,
    recipe
})

//* Thunks

export const getAllRecipes = () => async (dispatch) => {
    const res = await fetch('api/recipes');
    if (res.ok){
        const data = await res.json();
        dispatch(setAllRecipes(data))
    }else{
        const errors = await res.json()
        return errors
    }
}

export const addRecipe = (recipe) => async(dispatch) => {
    const res = await fetch('api/recipes/new-recipe', {
        method:'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)

    })

    if (res.ok){
        const data = await res.json();
        dispatch(setRecipe(data))
    }else{
        const errors = await res.json();
        return errors
    }
}

export const deleteRecipe = (recipe) => async(dispatch) => {
    const res = await fetch(`api/recipes/${recipe.id}`, {
        method:'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
    })

    if (res.ok){
        const data = await res.json();
        dispatch(removeRecipe(data))
    }else{
        const errors = await res.json();
        return errors
    }
}

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
