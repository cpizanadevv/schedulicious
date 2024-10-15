import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
    if(Object.keys(recipes).length > 0){
      setLoading(false);
    }
  }, [recipes])

  

  if (loading) return <p>Loading...</p>;

  const handleFav = async (recipeId) => {
    const recipe = recipes[recipeId];
    if (recipe) {
      if (recipe.favorited) {
        recipe.favorited = false;
        await dispatch(recipeActions.removeFavorite(recipeId));
      } else {
        recipe.favorited = true;
        await dispatch(recipeActions.addFavorite(recipeId));
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
      {/* <div className="recipes-search">
        <SearchBar />
      </div> */}
      <div className="filtering"></div>
      {!loading ?(
        <div className="all-recipes">
        {allRecipes ? (
          allRecipes.map((recipe,index) => (
            <div className="recipe-card" key={index}>
              <div className="meal-name">
                <h2 key={recipe.meal_name}>{recipe.meal_name}</h2>
                {user && recipe && (
                <div className="fav"
                  key={recipe.id} 
                  onClick={() => handleFav(recipe.id)}
                  onMouseEnter={() =>  setHoveredRecipeId(recipe.id)}
                  onMouseLeave={() =>  setHoveredRecipeId(null)}
                  >
                  {(hoveredRecipeId === recipe.id || recipe.favorited) ? <FaStar/> : <FaRegStar />}
                </div>
                  
                )}
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
                    {recipe.ingredients && recipe.ingredients.map((ingredient) => (
                      <li key={ingredient.id} className="recipe-ingredient">
                        {ingredient.ingredient_name}
                      </li>
                    ))}

                    </ul>
                  </div>
                </div>
              </div>
              <div className="to-recipe-div"> 
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
        
      ): <p>Loading ...</p>}
      
    </div>
  );
}

export default AllRecipesPage;
