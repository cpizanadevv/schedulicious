import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import "./RecipeFormPage.scss";
import Scraper from "./WebScraper";

function RecipeFormPage() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mealName, setMealName] = useState("");
  const [courseType, setCourse] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [measurements, setMeasurements] = useState([""]);
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipe = {
      meal_name: mealName,
      course_type: courseType,
      prep_time: prepTime,
      cook_time: cookTime,
      serving_size: servingSize,
      img: image,
    };

    dispatch(recipeActions.createRecipe(recipe));


  };

  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="create-recipe">
      <div className="banner">
        <img
          src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/CreateRecipe.png"
          alt="Create recipe banner"
        />
      </div>
      <div className="web-scraper">
        <h4>Have a recipe from another site?</h4>
        <Scraper />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="img">
            {imagePreview && (
              <img
                className="img-preview"
                src={imagePreview}
                alt="Image Preview"
              />
            )}
            <input
              className="img-input"
              type="file"
              accept="image/*"
              onChange={updateImage}
            />
          </div>
          <div className="text-inputs">
            <div className="input">
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
              />
              <label>Recipe Name</label>
            </div>
            <div className="input">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <label>Tags</label>
            </div>
            <div className="courses">
              <label>Course Type</label>
              <select
                value={courseType}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="">Select Course Type</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
                <option value="Drink">Drink</option>
              </select>
            </div>
            <div className="times">
              <div className="input">
                <input
                  type="text"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                />
                <label>Prep Time</label>
              </div>
              <div className="input">
                <input
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                />
                <label>Cook Time</label>
              </div>
            </div>
            <div className="input">
              <input
                type="text"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
              <label>Serving Size</label>
            </div>
          </div>
        </div>

        <div className="textareas">
          <div className="recipe-left">
            <div className="recipe-left-labels">
              <div>
                <label>Measurements</label>
              </div>
              <div>
                <label>Ingredients</label>
              </div>
            </div>
            <div>
              <div className="recipe-left-inputs">
                <div className="measurements">
                  <input type="" name="" id="" />
                </div>
                <div className="ingredients">
                  <input type="text" name="" id="" />
                </div>
              </div>
              {/* <div className="input">
                <label>Calories</label>
                <input
                  className="calories"
                  type="text"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
                <button className="cal-calc">Calculate</button>
              </div> */}
            </div>
          </div>

          <div className="recipe-right">
            <label>Instructions</label>
            <textarea className="instructions" 
            value={instructions}/>
            
          </div>
        </div>
        <div className="submit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default RecipeFormPage;
