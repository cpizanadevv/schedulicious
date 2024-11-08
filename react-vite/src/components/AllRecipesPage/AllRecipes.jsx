import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./AllRecipes.scss";
// import SearchBar from "../SearchBar/SearchBar";
import { FaRegStar, FaStar } from "react-icons/fa";

function AllRecipesPage() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const pageChange = useRef(null);
  const perPage = 5;
  const recipes = useSelector((state) => state.recipe.recipes || []);
  const user = useSelector((state) => state.session.user);
  const pages = useSelector((state) => state.recipe.pages || 1);

  const [loading, setLoading] = useState(true);
  const [hoveredRecipeId, setHoveredRecipeId] = useState(null);
  const [currPg, setCurrPg] = useState(1);
  const [recipeCache, setRecipeCache] = useState({});

  useEffect(() => {
    if (!recipeCache[currPg]) {
      setLoading(true);
      dispatch(recipeActions.getAllRecipes(currPg, perPage))
        .then(() => {
          setRecipeCache((prevCache) => ({
            ...prevCache,
            [currPg]: recipes,
          }));
          setLoading(false);
        })
    }
  }, [dispatch, currPg, perPage,recipes]);

  const cachedRecipes = recipeCache[currPg] || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currPg]);

  const handleNextPage = () => {
    if (currPg < pages) setCurrPg((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currPg > 1) setCurrPg((prevPage) => prevPage - 1);
  };

  const handleFav = async (recipeId) => {
    const recipe = cachedRecipes.find((recipe) => recipe.id === recipeId);
    if (recipe) {
      recipe.favorited = !recipe.favorited;
      if (recipe.favorited) {
        await dispatch(recipeActions.addFavorite(recipeId));
      } else {
        await dispatch(recipeActions.removeFavorite(recipeId));
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="all-recipes" ref={pageChange}>
          {cachedRecipes && cachedRecipes.length > 0 ? (
            cachedRecipes.map((recipe) => (
              <div className="recipe-card" key={`recipe-${recipe.id}`}>
                <div className="meal-name">
                  <h2>{recipe.meal_name}</h2>
                  {user && recipe && (
                    <div
                      className="fav"
                      onClick={() => handleFav(recipe.id)}
                      onMouseEnter={() => setHoveredRecipeId(recipe.id)}
                      onMouseLeave={() => setHoveredRecipeId(null)}
                    >
                      {hoveredRecipeId === recipe.id || recipe.favorited ? (
                        <FaStar />
                      ) : (
                        <FaRegStar />
                      )}
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
                      Prep time: {recipe.prep_time} | Cook time:{" "}
                      {recipe.cook_time} | Serves: {recipe.serving_size}
                    </div>
                    <div className="recipe-ingredients">
                      <h3>Ingredients:</h3>
                      <ul className="ingredient-list">
                        {recipe.ingredients &&
                          recipe.ingredients.map((ingredient, index) => (
                            <li
                              key={`ingredient-${index}`}
                              className="recipe-ingredient"
                            >
                              {ingredient.ingredient_name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="to-recipe-div">
                  <NavLink
                    to={`/recipes/${recipe.id}`}
                    className="to-recipe-nav"
                  >
                    <button className="to-recipe">See full recipe</button>
                  </NavLink>
                </div>
              </div>
            ))
          ) : (
            <h2>No Recipes</h2>
          )}
        </div>
      )}
      {cachedRecipes.length > 0 && (
        <div className="pagination">
          <button disabled={currPg === 1} onClick={handlePrevPage}>
            Previous
          </button>
          <span>
            Page {currPg} of {pages}
          </span>
          <button disabled={currPg === pages} onClick={handleNextPage}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AllRecipesPage;
