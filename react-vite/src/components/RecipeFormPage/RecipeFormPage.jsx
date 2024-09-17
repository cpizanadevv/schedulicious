import { useState } from "react";
//  useEffect,import { useNavigate } from "react-router-dom";, useSelector
import { useDispatch } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import * as tagActions from "../../redux/tag";
import * as ingActions from "../../redux/ingredient";
import "./RecipeFormPage.scss";
import Scraper from "./WebScraper";

function RecipeFormPage() {
  // const navigate = useNavigate(); will add later
  const dispatch = useDispatch();

  // ! Remove test useStates after testing

  const [mealName, setMealName] = useState("Posole Verde");
  const [courseType, setCourse] = useState("Breakfast");
  const [prepTime, setPrepTime] = useState("10 minutes");
  const [cookTime, setCookTime] = useState("10 minutes");
  const [servingSize, setServingSize] = useState(2);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // const [imageLoading, setImageLoading] = useState(false); Will add later
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [ingredients, setIngredients] = useState([
    { quantity: "1 cup", name: "flour" },
  ]);
  const [instructions, setInstructions] = useState(["Thinly slice onions"]);
  const [errors, setErrors] = useState({});
  // const [searchTags, setSearchTag] = useState('');
  // const loadTags = useSelector((state) => state.tag.tags)

  // useEffect(() => {
  //   dispatch(tagActions.getTags(tag))
  // }, [dispatch,tag])

  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  //?        Handling Tags

  // Adding tag to arr, for displaying
  const handleTags = () => {
    setTag("");
    setTags([...tags, tag]);
  };
  //  Removes tag, association only
  const handleDeleteTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(updatedTags);
  };

  // ?     Additional Inputs

  // Sets quantity and name to ingredient array
  const addIngredientField = () => {
    const lastIngredient = ingredients[ingredients.length - 1];
    if (lastIngredient && lastIngredient.quantity && lastIngredient.name) {
      // Add a new ingredient field
      setIngredients([...ingredients, { quantity: "", name: "" }]);
    } else {
      // Optionally, display a message or handle the case when the last ingredient is not filled
      setErrors({ ingredient: "Cannot be empty before adding more" });
    }
  };
  const removeEmptyIngredients = () => {
    const filteredIngredients = ingredients.filter(
      (ingredient) =>
        ingredient.quantity.trim() !== "" || ingredient.name.trim() !== ""
    );
    setIngredients(filteredIngredients);
  };

  // Sets each step to Instruction array
  const handleSteps = () => {
    const lastInstruction = instructions[instructions.length - 1];
    if (lastInstruction && lastInstruction.trim() !== "") {
      // Add a new step
      setInstructions([...instructions, ""]);
    } else {
      // handle the case when the last instruction is not filled
      setErrors({ instructions: "Cannot be empty before adding more" });
    }
  };

  const removeEmptyInstructions = () => {
    const filteredInstructions = instructions.filter(
      (instruction) => instruction.trim() !== ""
    );
    setInstructions(filteredInstructions);
  };

  // Creates new input field
  const handleFieldChange = (index, field, value) => {
    if (field === "quantity" || field === "ingredient") {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index][field === "quantity" ? "quantity" : "name"] =
        value;
      setIngredients(updatedIngredients);

      // After updating, remove any empty ingredient fields
      removeEmptyIngredients();
      setIngredients(updatedIngredients);
    } else if (field === "instruction") {
      const updatedInstructions = [...instructions];
      updatedInstructions[index] = value;
      setInstructions(updatedInstructions);

      // After updating, remove any empty instruction steps
      removeEmptyInstructions();
    }
  };

  // ! HANDLE SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Creates recipe to be submitted
    try {
      const formData = new FormData();

      formData.append("img", image);
      formData.append("meal_name", mealName);
      formData.append("course_type", courseType);
      formData.append("prep_time", prepTime);
      formData.append("cook_time", cookTime);
      formData.append("serving_size", servingSize);
      formData.append("instructions", instructions);

      //  Dispatches to backend
      const recipeData = await dispatch(recipeActions.addRecipe(formData));

      // Returns errs if any
      if (recipeData.errors) {
        return setErrors(recipeData);
      }

      const recipeId = recipeData?.id;

      // API call to grab nutritional values for macro calculation
      const ingredientPromises = ingredients.map(async (ingredient) => {
        try {
          const newIngredient = { name: ingredient.name };
          const addedIngredient = await dispatch(
            ingActions.addIngredient(newIngredient)
          );

          if (addedIngredient.errors) {
            return addedIngredient.errors;
          }

          const ingredientId = addedIngredient.id;
          const recipeIngredientData = {
            recipe_id: recipeId,
            ingredient_id: ingredientId,
            quantity: ingredient.quantity,
          };

          await dispatch(ingActions.addRecipeIngredient(recipeIngredientData));

          return ingredient.name;
        } catch (error) {
          return error;
        }
      });

      const ingredientResponses = await Promise.all(ingredientPromises);

      const tagsToAdd = [
        ...new Set(
          ingredientResponses.filter((name) => typeof name === "string")
        ),
      ];

      const tagPromises = tagsToAdd.map(async (tag) => {
        try {
          const tagData = { tag };
          const addedTag = await dispatch(tagActions.addTag(tagData));

          if (addedTag.errors) {
            return addedTag.errors;
          }

          const tagId = addedTag.id;
          return dispatch(tagActions.addRecipeTag(recipeId, tagId));
        } catch (error) {
          return error;
        }
      });

      await Promise.all(tagPromises);

      setErrors({});
    } catch (error) {
      return error;
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
      {/* <div className="web-scraper">
        <h4>Have a recipe from another site?</h4>
        <Scraper />
      </div> */}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="recipe-form">
        <div className="top">
          <div className="top-left">
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
              name="image"
              accept="image/*"
              onChange={updateImage}
              required
            />
            <div className="error-container">
              {errors.img && <p className="errors">{errors.img}</p>}
            </div>
          </div>
          <div className="top-right">
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
              {errors.meal_name && <p className="errors">{errors.mealName}</p>}
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

              {errors.tags && <p className="errors">{errors.tags}</p>}
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
              {errors.course_type && (
                <p className="errors">{errors.courseType}</p>
              )}
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
                {errors.prepTime && <p className="errors">{errors.prepTime}</p>}
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
                {errors.cookTime && <p className="errors">{errors.cookTime}</p>}
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
              {errors.serving_size && (
                <p className="errors">{errors.servingSize}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bottom">
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
              {errors.ingredient && (
                <p className="errors">{errors.ingredient}</p>
              )}
              <div className="add-more">
                <button type="button" onClick={addIngredientField}>
                  Add More
                </button>
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
                      placeholder={`Step ${
                        index + 1
                      }, (e.g., Thinly slice onions)`}
                    />
                  </div>
                ))}
              </div>
              <div className="error-container">
                {errors.instructions && (
                  <p className="error">{errors.instructions}</p>
                )}
              </div>
              <div className="add-more">
                <button type="button" onClick={handleSteps}>
                  Add Step
                </button>
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
