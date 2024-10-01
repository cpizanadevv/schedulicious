// import { useState } from "react"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useParams } from "react-router-dom";
import "./RecipePage.scss";

function RecipePage() {
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipe = useSelector((state) => state.recipe.recipe);
  // console.log('state', recipe)
  const currRecipe = Object.values(recipe);
  // console.log(currRecipe)

  useEffect(() => {
    dispatch(recipeActions.getSingleRecipe(recipeId));
  }, [dispatch, recipeId]);

  return (
    <div>
      {currRecipe != null &&
        currRecipe.map((recipe) => (
          <div>
            <div className="recipe-banner">
              <img src={recipe.img} alt={recipe.name} />
              <div className="recipe-banner-text">
                <h2>{recipe.meal_name}</h2>
              </div>
            </div>
            <div>{/* <div>Allergens</div> */}</div>
            <div className="nutri"></div>
            <div className="recipe-pg-top">
              <div className="recipe-pg-img">
                <img src={recipe.img} alt={recipe.name} />
              </div>
              <div className="equipment"></div>
              <div className="cookTime">
                <p>Prep Time: {recipe.prep_time}</p>
                <p>Cook Time: {recipe.cook_time}</p>
                <p>Serving Size: {recipe.serving_size}</p>
              </div>
              <div className="macros"></div>
            </div>
            <div>
              <div className="recipe-pg-bottom">
                <div className="recipe-pg-ingredients">
                <ul className="ingredients">
                  {recipe.ingredients &&
                    recipe.ingredients.map((ingredient) => (
                      <li>{ingredient.name}</li>
                    ))}
                </ul>
              </div>
              <div>
                <ul className="instructions">
                  {recipe.instructions &&
                    recipe.instructions.map((step,index) => <li>Step {index+1} {step}</li>)}
                </ul>
              </div>
              </div>
              
            </div>
          </div>
        ))}
    </div>
  );
}

export default RecipePage;
