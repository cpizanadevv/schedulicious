// import { useState } from "react"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useParams } from "react-router-dom";

function RecipePage() {
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipe = useSelector((state) => state.recipe.recipe);

  const currRecipe = Object.values(recipe);

  useEffect(() => {
    dispatch(recipeActions.getSingleRecipe(recipeId));
  }, [dispatch]);

  return (
    <div>
      {currRecipe &&
        currRecipe.map((recipe) => (
          <div>
            <div className="banner">
              <img src={recipe.img} alt={recipe.name} />
            </div>
            <div>
              <div>
                <h2>{recipe.name}</h2>
              </div>
              <div>Allergens</div>
            </div>
            <div className="recipe-img">
              <img src={recipe.img} alt={recipe.name} />
            </div>
            <div className="nutri"></div>
            <div>
              <div className="equipment"></div>
              <div className="cookTime">
                <p>Prep Time: {recipe.prep_time}</p>
                <p>Cook Time: {recipe.cook_time}</p>
                <p>Serving Size: {recipe.serving_size}</p>
                </div>
              <div className="macros"></div>
            </div>
            <div>
                <div>
                    <ul>
                        {recipe.ingredients && recipe.ingredients.map((ingredient) => (
                            <li>{ingredient.name}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <ul>
                    {recipe.instructions && recipe.instructions.map((step) =>(
                        <li>{step}</li>
                    ))}

                    </ul>
                </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default RecipePage;
