import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AllRecipes.scss";
import SearchBar from "../SearchBar/SearchBar";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

function AllRecipesPage() {
  const navigate = useNavigate();
  const recipes = useSelector((state) => state.recipe.recipes || {});
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const allRecipes = Object.values(recipes);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(recipeActions.getAllRecipes());
    dispatch(recipeActions.getAllFavs());
    setLoading(false);
  }, [dispatch,recipes]);

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
        {allRecipes && allRecipes.map((recipe) => (
          <div key={recipe.id} className="recipes">
                  <div className="fav" onClick={() => handleFav(recipe.id)}>
                    {recipe.favorited ? <FaStar /> : <FaRegStar />}
                  </div>
            <NavLink
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="recipe-card"
            >
              <div className="recipe-img">
                {recipe.img && <img src={recipe.img} alt={recipe.meal_name} />}
                <div className="overlay">
                  <div className="overlay-text">Allergens:</div>
                </div>
              </div>
              <div className="recipe-info">
                <div className="info-top">
                  <h3 className="recipe-name">{recipe.meal_name}</h3>
                </div>
                <ul className="recipe-ingredients">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="recipe-ingredient">
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRecipesPage;
