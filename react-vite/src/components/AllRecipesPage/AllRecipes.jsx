import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./AllRecipes.css";

function AllRecipesPage() {
  const recipes = useSelector((state) => state.recipe.recipes || {});
  const dispatch = useDispatch();
  const allRecipes = Object.values(recipes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(recipeActions.getAllRecipes());
    setLoading(false);
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/recipeBanner.png" alt="" />
      </div>
      <div className="search">
        <input type="search" />
      </div>
      <div className="filtering"></div>
      <div className="all-recipes">
        {allRecipes.map((recipe) => (
          <NavLink key={recipe.id} to={`/recipes/${recipe.id}`}>
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-img">
                {recipe.img && <img src={recipe.img} alt={recipe.meal_name} />}
                <div className="overlay">
                  <div className="overlay-text">Allergens:</div>
                </div>
              </div>
              <div className="recipe-info">
                <h3 className="recipe-name">{recipe.meal_name}</h3>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default AllRecipesPage;
