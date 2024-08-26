import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import "./RecipeFormPage.css";
import createRecipeBanner from "../../../public/createRecipeBanner.png";

function RecipeFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mealName, setMealName] = useState("");
  const [courseType, setCourse] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new Recipe();
    data.append("meal_name", mealName);
    data.append("course_type", courseType);
    data.append("prep_time", prepTime);
    data.append("cook_time", cookTime);
    data.append("serving_size", servingSize);
    data.append("calories", calories);
    data.append("img", image);

    dispatch(recipeActions.createRecipe(data));
  };

  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="create-recipe">
      <img
        className="banner"
        src={createRecipeBanner}
        alt="Create recipe banner"
      />
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
            <input type="file" accept="image/*" onChange={updateImage} />
          </div>
          <div className="text-inputs">
            <div>
              <label>Recipe Name</label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
              />
            </div>
            {/* <div>
              <label>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div> */}
            <div>
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
              <label>Prep Time</label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
              <label>Cook Time</label>
              <input
                type="text"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
            <div>
              <label>Serving Size</label>
              <input
                type="text"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
            </div>
            <div>
              <label>Calories</label>
              <input
                type="text"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="textareas">
          <div>
            <div className="measurements">
              <label>Measurements</label>
              <input type="" name="" id="" />
            </div>
            <div className="ingredients">
              <label>Ingredients</label>
              <input type="text" name="" id="" />
            </div>
          </div>

          <div className="instructions">
            <label>Instructions</label>
            <textarea name="" id=""></textarea>
          </div>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default RecipeFormPage;
