const SET_INGREDIENT = "ingredient/setIngredient";
const REMOVE_INGREDIENT = "ingredient/removeIngredient";

// * Actions
const setIngredient = (ingredient) => ({
  type: SET_INGREDIENT,
  payload: ingredient,
});

const removeIngredient = (id) => ({
  type: REMOVE_INGREDIENT,
  payload: id,
});

//* Thunks

export const addIngredient = (ingredient) => async (dispatch) => {
  try {
    const res = await fetch("/api/ingredients/add-ingredient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ingredient),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(setIngredient(data));
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (error) {
    return { error: "An error occurred. Please try again later." };
  }
};

export const addRecipeIngredient =
  (recipeId, ingredientId) => async (dispatch) => {
    try {
      const res = await fetch(
        `/api/ingredients/${recipeId}/${ingredientId}/add-recipe-ingredient`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ingredient),
        }
      );
      if (res.ok) {
        const data = await res.json();
        dispatch(setIngredient(data));
      } else {
        const errors = await res.json();
        return errors;
      }
    } catch (error) {
      return { error: "An error occurred. Please try again later." };
    }
  };

export const deleteRecipeIngredient =
  (recipeIngredient) => async (dispatch) => {
    try {
      const res = await fetch(
        `/api/ingredients/${recipeIngredient.recipeId}/${recipeIngredient.ingredientId}`,
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

const initialState = { recipeIngredient: {}, ingredient: {} };

function ingredientReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INGREDIENT:
      return {
        ...state,
        recipeIngredient: {
          ...state.ingredient,
          [action.payload.ingredient.id]: action.payload.ingredient,
        },
      };

    case REMOVE_INGREDIENT:
      const newState = { ...state };
      delete newState.ingredient[action.payload.id];
      delete newState.recipe_ingredient[action.payload.id];
      return newState;

    default:
      return state;
  }
}

export default ingredientReducer;
