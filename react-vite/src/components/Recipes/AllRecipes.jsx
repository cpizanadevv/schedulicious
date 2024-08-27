import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
            <img src="" alt="" />
        </div>
        <div className="search">
            <input type="search" />
        </div>
        <div className="filtering">
            
        </div>
      <div className="all-recipes">
        {allRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <NavLink to={`/recipe/${recipe.id}`}>
              <h3>{recipe.meal_name}</h3>
              <p>Course: {recipe.course_type}</p>
              <p>Prep Time: {recipe.prep_time} minutes</p>
              <p>Cook Time: {recipe.cook_time} minutes</p>
              <p>Serving Size: {recipe.serving_size}</p>
              <p>Calories: {recipe.calories}</p>
              {recipe.img && <img src={recipe.img} alt={recipe.meal_name} />}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRecipesPage;
