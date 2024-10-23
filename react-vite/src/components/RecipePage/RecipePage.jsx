// import { useState } from "react"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";
import RecipeDelete from "../Deletes/DeleteRecipe";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CommentsSection from '../Comments/Comments'
import "./RecipePage.scss";

function RecipePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipe = useSelector((state) => state.recipe.recipe);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(recipeActions.getSingleRecipe(recipeId));
  }, [dispatch, recipeId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleUpdate = () => {
    navigate(`/update-recipe/${recipeId}`);
  };

  const handleGoBack = () => {
    navigate(`/recipes`);
  }

  return (
    <div>
      {recipe ? (
        <div>
          <div className="recipe-banner">
            <img src={recipe.img} alt={recipe.name} />
            <div className="recipe-banner-text">
              <h2>{recipe.meal_name}</h2>
            </div>
          </div>
          <div className="recipe-pg-top">
            <div className="recipe-go-back" onClick={handleGoBack}>
              <span className="tooltiptext">All Recipes</span>
              <IoArrowBackCircle className="recipe-go-back-icon" />
            </div>
            <div className="recipe-pg-img">
              <img src={recipe.img} alt="" />
              {user && user.id === recipe.user_id && ( // Check if user exists and has access to edit/delete
                <div className="recipe-pg-buttons">
                  <div className="recipe-button">
                    <span className="tooltiptext">Update Recipe</span>
                    <button onClick={handleUpdate} id="recipe-update">
                      <FaEdit />
                    </button>
                  </div>
                  <div className="recipe-button">
                    <span className="tooltiptext">Delete Recipe</span>
                    <OpenModalButton
                      buttonText={<FaTrashAlt />}
                      modalComponent={<RecipeDelete id={recipeId} />}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="recipe-pg-bottom">
            <div className="bottom-top">
              <div className="recipe-pg-ingredients">
                <label>Ingredients</label>
                <ul className="ingredients">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.quantity} {ingredient.ingredient_name}
                      </li>
                    ))
                  ) : (
                    <li>No ingredients available.</li>
                  )}
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
                {recipe.instructions && recipe.instructions.length > 0 ? (
                  recipe.instructions.map((step, index) => (
                    <li className="instruct" key={index}>
                      <h4>Step {index + 1}</h4>
                      {step}
                    </li>
                  ))
                ) : (
                  <li>No instructions available.</li>
                )}
              </ul>
            </div>
          </div>
          <div>
                <CommentsSection id={recipeId}/>
          </div>
        </div>
      ) : (
        <p>Loading recipe...</p>
      )}
    </div>
  );
}

export default RecipePage;
