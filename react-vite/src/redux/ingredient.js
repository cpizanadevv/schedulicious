const SET_INGREDIENT = "ingredient/setIngredient";
const SET_RECIPE_INGREDIENT = "recipeIngredient/setRecipeIngredient";
const REMOVE_INGREDIENT = "ingredient/removeIngredient";

// * Actions
const setIngredient = (ingredient) => ({
  type: SET_INGREDIENT,
  payload: ingredient,
});
const setRecipeIngredient = (recipeIngredient) => ({
  type: SET_RECIPE_INGREDIENT,
  payload: recipeIngredient,
});

const removeIngredient = (id) => ({
  type: REMOVE_INGREDIENT,
  payload: id,
});

//* Thunks

export const addIngredient = (ingredient) => async (dispatch) => {
  const res = await fetch("/api/ingredients/add-ingredient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(setIngredient(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const addRecipeIngredient = (ingredient) => async (dispatch) => {
  const res = await fetch(
    `/api/ingredients/add-recipe-ingredient/${ingredient.recipe_id}/${ingredient.ingredient_id}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ingredient),
    }
  );
  if (res.ok) {
    const data = await res.json();
    dispatch(setRecipeIngredient(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteRecipeIngredient =
  (recipeIngredient) => async (dispatch) => {
    try {
      const res = await fetch(
        `/api/ingredients/${recipeIngredient.recipe_id}/${recipeIngredient.ingredient_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        const data = await res.json();
        dispatch(removeIngredient(recipeIngredient.id));

        if (data.ingredientDeleted) {
          dispatch(removeIngredient(recipeIngredient.ingredientId));
        }
      } else {
        const errors = await res.json();
        return errors;
      }
    } catch (error) {
      return { error: "An error occurred. Please try again later." };
    }
  };

export const searchIngredient = (name) => async () => {
  try {
    console.log(name)
    const response = await fetch(`/api/ingredients/search_ingredient/${name}`);
    if (response.ok) {
      const data = await response.json();
      console.log('thunk data', data)
      return data;
    }
  } catch (error) {
  }
};

export const getNutrientInfo = (id) => async () => {
      const response = await fetch(`/api/ingredients/get_nutrient_info/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data
      } else {
        const errors = await response.json();
        return errors
          
      }
};

const initialState = { recipeIngredient: {}, ingredient: {} };

function ingredientReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INGREDIENT:
      return {
        ...state,
        ingredient: {
          ...state.ingredient,
          [action.payload.id]: { ...action.payload },
        },
      };
    case SET_RECIPE_INGREDIENT:
      return {
        ...state,
        recipeIngredient: {
          ...state.recipeIngredient,
          ...action.payload,
        },
      };
    case REMOVE_INGREDIENT: {
      const newState = { ...state };
      delete newState.ingredient[action.payload.id];
      delete newState.recipeIngredient[action.payload.id];
      return newState;
    }
    default:
      return state;
  }
}

export default ingredientReducer;
