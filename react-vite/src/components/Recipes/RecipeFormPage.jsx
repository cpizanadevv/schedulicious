import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as recipeActions from "../../redux/recipe";
import './RecipeFormPage.css'

function RecipeFormPage() {
  const [meal_name, setMealName] = useState("");
  const [course_type, setCourse] = useState("");
  const [prep_time, setPrepTime] = useState("");
  const [cook_time, setCookTime] = useState("");
  const [serving_size, setServingSize] = useState(0);
  const [calories, setCalories] = useState("");
  const [tags, setTags] = useState([]);

  return (
    <div className="create-recipe">
      <form>
        <div className="inputs">
          <div className="img">
            <input type="file" name="" id="" />
          </div>
          <div className="text-inputs">
            <div>
              <label>Recipe Name</label>
              <input
                type="text"
                value={meal_name}
                onChange={(e) => setMealName(e.target.value)}
              />
            </div>
            <div>
              <label>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setMealName(e.target.value)}
              />
            </div>
            <div>
            <label>Course Type</label>
              <select name="" id="">
                <option value="">Breakfast</option>
                <option value="">Lunch</option>
                <option value="">Dinner</option>
                <option value="">Snack</option>
                <option value="">Drink</option>
              </select>
            </div>
            <div className="times">
            <label>Prep Time</label>
              <input
                type="text"
                value={prep_time}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            <label>Cook Time</label>
              <input
                type="text"
                value={cook_time}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
            <div>
            <label>Serving Size</label>
              <input
                type="text"
                value={serving_size}
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
          <div className="ingredients">
          <label>Ingredients</label>
          <input type="text" name="" id="" />

          </div>
          <div className="instructions">
          <label>Instructions</label>
          <textarea name="" id=""></textarea>

          </div>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default RecipeFormPage;
