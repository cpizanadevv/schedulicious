// import { useState } from "react"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useNavigate, useParams } from "react-router-dom";
import "./RecipePage.scss";

function RecipePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipe = useSelector((state) => state.recipe);
  const user = useSelector((state) => state.session.user)

  useEffect(() => {
    dispatch(recipeActions.getSingleRecipe(recipeId));
  }, [dispatch, recipeId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleUpdate = () => {
    navigate(`/update-recipe/${recipeId}`);
  }

  return (
    <div>
      {recipe != null &&
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
                        recipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient.quantity} {ingredient.ingredient_name}</li>
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
                        <li className="instruct" key={index}>
                          <h4>Step {index + 1}</h4>
                           {step}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>}
    </div>
  );
}

export default RecipePage;
