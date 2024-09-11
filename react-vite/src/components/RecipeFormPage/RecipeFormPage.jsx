import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import * as tagActions from "../../redux/tag";
import * as ingActions from '../../redux/ingredient'
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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [quantity, setQuantity] = useState(['']);
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.session.user)

  const currUser = user ? user: null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipe = {
      user_id:currUser.id,
      meal_name: mealName,
      course_type: courseType,
      prep_time: prepTime,
      cook_time: cookTime,
      serving_size: servingSize,
      img: image,
      instructions: instructions,
    };
    const recipeData = await dispatch(recipeActions.addRecipe(recipe));

    const recipeId = recipeData.id


    if(recipeData.errors) {
      return setErrors(recipeData)
    }

    for (const ingredient of ingredients) {
      const nutritionalData = await fetchNutritionalData(ingredient.name);

      ingredientWNutrition = {
        ...ingredient,
        calories: nutritionalData.calories || 0,
        protein: nutritionalData.protein || 0,
        fat: nutritionalData.fat || 0,
        carbs: nutritionalData.carbs || 0,
      }
      const ingredientData = await dispatch(ingActions.addIngredient(ingredientWNutrition))

      if(ingredientData.errors) {
        
        return setErrors(ingredientData)
      }

      const ingredientId = ingredientData.id;

      await dispatch(ingActions.addRecipeIngredient(recipeId,ingredientId, ingredient.quantity))

    }


  };

  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleTags = () => {
    const currTag = {
      tag: tag,
    };
    dispatch(tagActions.addTag(currTag));
    setTag("");
    setTags([...tags, tag]);
  };

  const handleDeleteTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(updatedTags);
  };

  const handleAddField = () => {
    setQuantity([...quantity, ""]);
    setIngredients([...ingredients, ""]);
  };

  const handleSteps = () => {
    setInstructions([...instructions, ""]);
  };

  const handleFieldChange = (index, field, value) => {
    if (field === "quantity") {
      const updatedQuantities = [...quantity];
      updatedQuantities[index] = value;
      setQuantity(updatedQuantities);
    } else if (field === "ingredient") {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = value;
      setIngredients(updatedIngredients);
    } else if (field === "instruction") {
      const updatedInstructions = [...instructions];
      updatedInstructions[index] = value;
      setInstructions(updatedInstructions);
    }
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
          {errors.img && <p>{errors.img}</p>}
          </div>
          <div className="text-inputs">
            <div className="input">
              <div className="labels">
                <label>Recipe Name</label>
              </div>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
              />
              {errors.meal_name && <p>{errors.meal_name}</p>}
            </div>
            <div className="input">
              <div className="labels">
                <label>Tags</label>
              </div>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTags();
                  }
                }}
              />
              
          {errors.tags && <p>{errors.tags}</p>}
              <div className="tag-list">
                {tags.length > 0 &&
                  tags.map((t, index) => (
                    <div key={index} className="tag-item">
                      {t}
                      <span
                        className="delete-tag"
                        onClick={() => handleDeleteTag(index)}
                      >
                        x
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="courses">
              <label>Course Type</label>
              <select
                className="course-select"
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
              {errors.course_type && <p>{errors.course_type}</p>}
            </div>
            <div className="times">
            <div className="labels">
                <label>Prep Time</label>
              </div>
              <div className="input">
                <input
                  type="text"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                />
          {errors.prepTime && <p>{errors.prepTime}</p>}
              </div>
              <div className="input">
              <div className="labels">
                <label>Cook Time</label>
              </div>
                <input
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                />
          {errors.cookTime && <p>{errors.cookTime}</p>}
              </div>
            </div>
            <div className="input">
              <div className="labels">
                <label>Serving Size</label>
              </div>
              <input
                type="text"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
          {errors.serving_size && <p>{errors.serving_size}</p>}
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
            <div className="border">
              <div className="recipe-left-inputs">
                <div className="measure">
                  {quantity.map((quantity, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) =>
                          handleFieldChange(index, "quantity", e.target.value)
                        }
                        placeholder="Measurement"
                      />
                    </div>
                  ))}
                </div>
                <div className="ingredients">
                  {ingredients.map((ingredient, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) =>
                          handleFieldChange(index, "ingredient", e.target.value)
                        }
                        placeholder="Ingredient"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="add-more">
                <button type="button" onClick={handleAddField}>
                  Add More
                </button>
                {errors.ingredient && <p>{errors.ingredient}</p>}
              </div>
            </div>
          </div>
          <div className="recipe-right">
            <div className="recipe-right-label">
              <label>Instructions</label>
            </div>
            <div className="border">
              <div className=".recipe-left-inputs">
              {instructions.map((instruction, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={instruction}
                className="instructions"
                        onChange={(e) =>
                          handleFieldChange(index, "instruction", e.target.value)
                        }
                        placeholder={`Step ${index +1}`}
                      />
                    </div>
                  ))}
                
              </div>
              <div className="add-more">
                <button type="button" onClick={handleSteps}>
                  Add Step
                </button>
                {errors.instruction && <p>{errors.instruction}</p>}
              </div>
            </div>
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
