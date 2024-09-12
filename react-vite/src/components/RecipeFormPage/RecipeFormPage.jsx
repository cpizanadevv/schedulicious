import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import * as tagActions from "../../redux/tag";
import * as ingActions from "../../redux/ingredient";
import "./RecipeFormPage.scss";
import Scraper from "./WebScraper";

function RecipeFormPage() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mealName, setMealName] = useState("Posole Verde");
  const [courseType, setCourse] = useState("Breakfast");
  const [prepTime, setPrepTime] = useState("10 minutes");
  const [cookTime, setCookTime] = useState("10 minutes");
  const [servingSize, setServingSize] = useState(2);
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [imageLoading, setImageLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  // const [quantity, setQuantity] = useState([""]);
  const [ingredients, setIngredients] = useState([{ quantity: "1 cup", name: "flour" }]);
  const [instructions, setInstructions] = useState(["Thinly slice onions"]);
  const [errors, setErrors] = useState({});
  // const user = useSelector((state) => state.session.user);


  const handleSubmit = async (e) => {
    e.preventDefault();


    // const recipe = {
    //   meal_name: mealName,
    //   course_type: courseType,
    //   prep_time: prepTime,
    //   cook_time: cookTime,
    //   serving_size: servingSize,
    //   img: image,
    //   instructions,
    // };  

    
    const formData = new FormData();

    formData.append("img", image);
    formData.append("meal_name", mealName);
    formData.append("course_type", courseType);
    formData.append("prep_time", prepTime);
    formData.append("cook_time", cookTime);
    formData.append("serving_size", servingSize);
    formData.append("instructions", instructions);


    
    const recipeData = await dispatch(recipeActions.addRecipe(formData));
    console.log("THIS IS RECIPE", recipeData)
    
    if (recipeData.errors) {
      return setErrors(recipeData);
    }

    const recipeId = recipeData.id;

    const ingredientPromises = ingredient.map(async (ingredient) => {
      // Fetch nutritional data for the ingredient
      const nutritionalData = await fetchNutritionalData(ingredient.name);
      const ingredientWithNutrition = {
        ...ingredient,
        calories: nutritionalData.calories || 0,
        protein: nutritionalData.protein || 0,
        fat: nutritionalData.fat || 0,
        carbs: nutritionalData.carbs || 0,
      };
  
      // Add ingredient
      const addedIngredient = await dispatch(ingActions.addIngredient(ingredientWithNutrition));
      if (addedIngredient.errors) {
        return setErrors(addedIngredient.errors);
      }
  
      const ingredientId = addedIngredient.id;
  
      // Associate ingredient with recipe
      const recipeIngredientData = await dispatch(ingActions.addRecipeIngredient(recipeId, ingredientId));
      if (recipeIngredientData.errors) {
        return setErrors(recipeIngredientData.errors);
      }
  
      return ingredientId; // Return ingredientId for debugging purposes
    });
  
    await Promise.all(ingredientPromises);
    console.log("THIS IS INGREDIENT PROMISES", ingredientPromises)
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

  const addIngredientField = () => {
    setIngredients([...ingredients, { quantity: "", name: "" }]);
  };

  const handleSteps = () => {
    setInstructions([...instructions, ""]);
  };

  const handleFieldChange = (index, field, value) => {
    if (field === "quantity" || field === "ingredient") {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index][field === "quantity" ? "quantity" : "name"] =
        value;
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
							required
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
                placeholder="Name (e.g., Posole Verde)"
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
                placeholder="(e.g., nuts)"
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
                placeholder="(e.g., 10 minutes)"
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
                  placeholder="(e.g., 10 minutes)"
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
                placeholder="(e.g., 4)"
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
              <div>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="recipe-left-inputs">
                    <input
                      type="text"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleFieldChange(index, "quantity", e.target.value)
                      }
                      placeholder="(e.g., 1 cup)"
                      className="quantity-input"
                    />
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleFieldChange(index, "ingredient", e.target.value)
                      }
                      placeholder="(e.g., flour)"
                      className="ingredient-input"
                    />
                  </div>
                ))}
              </div>
              <div className="add-more">
                <button type="button" onClick={addIngredientField}>
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
                      placeholder={`Step ${index + 1}, (e.g., Thinly slice onions)`}
                    />
                  </div>
                ))}
              </div>
              <div className="add-more">
                <button type="button" onClick={handleSteps}>
                  Add Step
                </button>
                {errors.instructions && <p>{errors.instructions}</p>}
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
