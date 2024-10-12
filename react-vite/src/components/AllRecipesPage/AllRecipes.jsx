import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AllRecipes.scss";
import SearchBar from "../SearchBar/SearchBar";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

function AllRecipesPage() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const recipes = useSelector((state) => state.recipe.recipes || {});
  const user = useSelector((state) => state.session.user);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [hoveredRecipeId, setHoveredRecipeId] = useState(null);
  
  const allRecipes = Object.values(recipes);

  useEffect(() => {
    dispatch(recipeActions.getAllRecipes());
  }, [dispatch]);

  useEffect(() => {
    if(recipes){
      setLoading(false);
    }
  }, [recipes])
  

  if (loading) return <p>Loading...</p>;

  const handleFav = async (recipeId) => {
    if (allRecipes[recipeId - 1].favorited) {
      const res = dispatch(recipeActions.removeFavorite(recipeId));
      if (res.errors) {
        setErrors(res.errors);
      }
    } else {
      const res = dispatch(recipeActions.addFavorite(recipeId));
      if (res.errors) {
        setErrors(res.errors);
      }
    }
  };



  return (
    <div>
      <div className="banner">
        <img
          src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/recipeBanner.png"
          alt=""
        />
      </div>
      <div className="recipes-search">
        <SearchBar />
      </div>
      <div className="filtering"></div>
      <div className="all-recipes">
        {allRecipes ? (
          allRecipes.map((recipe) => (
            <div className="recipe-card" key={recipe.id}>
              <div className="meal-name">
                <h2 key={recipe.meal_name}>{recipe.meal_name}</h2>
                
                <div className="fav" 
                  onClick={() => handleFav(recipe.id)}
                  onMouseEnter={() =>  setHoveredRecipeId(recipe.id)}
                  onMouseLeave={() =>  setHoveredRecipeId(null)}
                  >
                  {(hoveredRecipeId === recipe.id || recipe.favorited) ? <FaStar/> : <FaRegStar />}
                </div>
              </div>
              <hr />
              <div className="recipe-info">
                <div className="recipe-img">
                  <img src={recipe.img} alt="" />
                </div>
                <div className="recipe-details">
                  <div className="timings">
                    Prep time: {recipe.prep_time} | Cook time: {recipe.cook_time} | Serves: {recipe.serving_size}
                  </div>
                  <div className="recipe-ingredients">
                    <h3>Ingredients:</h3>
                    <ul className="ingredient-list">
                    {recipe.ingredients.map((ingredient) => (
                      <li key={ingredient.id} className="recipe-ingredient">
                        {ingredient.ingredient_name}
                      </li>
                    ))}

                    </ul>
                  </div>
                </div>
              </div>
              <div> 
                <NavLink to={`/recipes/${recipe.id}`} className="to-recipe-nav">
                  <button className="to-recipe">See full recipe</button>
                </NavLink>
              </div>
            </div>
          ))
        ) : (
          <h2>No Recipes</h2>
        )}
      </div>
    </div>
  );
}

export default AllRecipesPage;
