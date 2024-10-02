// import { useState } from "react"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { Parallax } from 'react-parallax';
import { useParams } from "react-router-dom";
import "./RecipePage.scss";

function RecipePage() {
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipe = useSelector((state) => state.recipe.recipe);
  const user = useSelector((state) => state.session.user)
  // console.log('state', recipe)
  const currRecipe = Object.values(recipe);
  // console.log(currRecipe)

  useEffect(() => {
    dispatch(recipeActions.getSingleRecipe(recipeId));
  }, [dispatch, recipeId]);

  const handleUpdate = (e) => {
    
  }

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
              <img src={recipe.img} alt="" />
      {/* <Parallax
        bgImage={recipe.img}
        strength={500}
      >
        <div className="parallax-content">
              <div className="recipe-banner-text">
                <h2>{recipe.meal_name}</h2>
              </div>
        </div>
      </Parallax> */}
      {user.id == recipe.user_id && (
      <div className="recipe-pg-buttons">
        <button onClick={handleUpdate} id="recipe-update" className="recipe-button">Update</button>
        <button id="recipe-delete" className="recipe-button">Delete</button>
      </div>

      )}
    </div>
              {/* <div className="recipe-pg-img" style={{ backgroundImage: `url(${recipe.img})` }}>
                {/* <img src={recipe.img} alt={recipe.name} /> 
              </div> */}

              <div className="equipment"></div>
              <div className="macros"></div>
            </div>
            <div>
              <div className="recipe-pg-bottom">
                <div className="bottom-top">
                  <div className="recipe-pg-ingredients">
                    <label>Ingredients</label>
                    <ul className="ingredients">
                      {recipe.ingredients &&
                        recipe.ingredients.map((ingredient) => (
                          <li>{ingredient.quantity} {ingredient.ingredient_name}</li>
                        ))}
                    </ul>
                  </div>
              <div className="cookTime">
                <p>Prep Time: {recipe.prep_time}</p>
                <p>Cook Time: {recipe.cook_time}</p>
                <p>Serving Size: {recipe.serving_size}</p>
              </div>
                </div>

                <div className="bottom-bottom">
                  <label>Instructions</label>
                  <ul className="instructions">
                    {recipe.instructions &&
                      recipe.instructions.map((step, index) => (
                        <li className="instruct">
                          <h4>Step {index + 1}</h4>
                           {step}
                        </li>
                      ))}
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
