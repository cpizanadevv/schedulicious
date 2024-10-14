import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import LoadingModal from "../LoadingModal/LoadingModal";
import * as recipeActions from "../../redux/recipe";
import * as tagActions from "../../redux/tag";
import * as ingActions from "../../redux/ingredient";
import "./RecipeFormPage.scss";
// import Scraper from "./WebScraper";

function RecipeFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  // ! Remove test useStates after testing

  const [isLoading, setIsLoading] = useState(false);
  const [mealName, setMealName] = useState("");
  const [courseType, setCourse] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servingSize, setServingSize] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [ingredients, setIngredients] = useState([{ quantity: "", name: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [errors, setErrors] = useState({});
  const { closeModal, setModalContent } = useModal();

  // useEffect(() => {
  //   // Validation checking
  //   const errs = {}
  //   if (!image || !imagePreview) {
  //     errs.img= "An image is required";
  //   }
  //   if (!mealName) {
  //     errs.meal_name= "Recipe Name is required";
  //   }
  //   if (!courseType) {
  //     errs.course_type= "Course Type is required";
  //   }
  //   if (!prepTime || prepTime.length < 1) {
  //     errs.prep_time= "Prep Time is required";
  //   }
  //   if (!cookTime || cookTime.length < 1) {
  //     errs.cook_time= "Cook Time is required";
  //   }
  //   if (!servingSize || servingSize < 0) {
  //     errs.serving_size= "Serving Size is required";
  //   }

  //   if(errs){
  //     setErrors(errs)
  //   }

  // },[image,imagePreview,mealName,courseType,prepTime,cookTime,servingSize])

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  },[user]);

  useEffect(() => {
    if (isLoading) {
      setModalContent(<LoadingModal />);
    }
  }, [isLoading]);

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
      (step) => step.trim() !== ""
    );
    setInstructions(filteredInstructions);
    console.log('filtered', filteredInstructions)
  };

  // Creates new input field
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

  // ! HANDLE SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("ing", ingredients.length <= 1);
    const errs = {};
    if (!image || !imagePreview) {
      errs.img = "An image is required";
    }
    if (!mealName) {
      errs.meal_name = "Recipe Name is required";
    }
    if (!courseType) {
      errs.course_type = "Course Type is required";
    }
    if (!prepTime || prepTime.length < 1) {
      errs.prep_time = "Prep Time is required";
    }
    if (!cookTime || cookTime.length < 1) {
      errs.cook_time = "Cook Time is required";
    }
    if (!servingSize || servingSize < 0) {
      errs.serving_size = "Serving Size is required";
    }
    if (
      ingredients.length === 0 ||
      ingredients.every((ing) => !ing.quantity.trim() && !ing.name.trim())
    ) {
      errs.ingredient = "At least one ingredient is required";
    }
    if (instructions.length === 0 || 
      instructions.every(inst => !inst.trim())) {
    errs.instructions = "At least one instruction is required";
  }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if(ingredients.length > 1){
      removeEmptyIngredients();
    }

    let withDelimiter = ''
    if(instructions.length > 1){
      removeEmptyInstructions();
      withDelimiter = instructions.join(" | ")
    }
    // console.log('input', withDelimiter , instructions)
    // console.log('len', instructions.length > 1)
    const formData = new FormData();

    formData.append("img", image);
    formData.append("meal_name", mealName);
    formData.append("course_type", courseType);
    formData.append("prep_time", prepTime);
    formData.append("cook_time", cookTime);
    formData.append("serving_size", servingSize);
    formData.append("instructions", withDelimiter || instructions[0]);
    // console.log('instr', instructions)
    // console.log('ing', ingredients)

    //  Dispatches to backend
    setIsLoading(true);
    const recipeData = await dispatch(recipeActions.addRecipe(formData));
    // Returns errs if any
    if (recipeData.errors) {
      setErrors(recipeData.errors);
      setIsLoading(false)
      return;
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

    if(ingredientResponses.errors){
      setErrors(ingredientResponses.errors)
      return
    }

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
      } catch (errors) {
        return errors;
      }
    });

    await Promise.all(tagPromises);
    setMealName("");
    setCourse("");
    setPrepTime("");
    setCookTime("");
    setServingSize("");
    setImage("");
    setImagePreview("");
    setTags([""]);
    setIngredients([{ quantity: "", name: "" }]);
    setInstructions([""]);
    setIsLoading(false);
    closeModal();
    navigate(`/recipes/${recipeId}`);
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
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="recipe-form"
      >
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
              <div className="error-container">
                {errors.meal_name && (
                  <p className="errors">{errors.meal_name}</p>
                )}
              </div>
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

              <div className="error-container">
                {errors.tags && <p className="errors">{errors.tags}</p>}
              </div>
              <div className="tag-list">
                {tags.length > 0 &&
                  tags.map((t, index) => (
                    <div key={index} className="tag-item">
                      <div className="tag-name">{t}</div>

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
            <div className="input">
              <div className="labels">
                <label>Course Type</label>
              </div>
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
              <div className="error-container">
                {errors.course_type && (
                  <p className="errors">{errors.course_type}</p>
                )}
              </div>
            </div>
            <div className="times">
              <div className="input">
                <div className="labels">
                  <label>Prep Time</label>
                </div>
                <input
                  type="text"
                  value={prepTime}
                  placeholder="(e.g., 10 minutes)"
                  onChange={(e) => setPrepTime(e.target.value)}
                />
                <div className="error-container">
                  {errors.prep_time && (
                    <p className="errors">{errors.prep_time}</p>
                  )}
                </div>
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
                <div className="error-container">
                  {errors.cook_time && (
                    <p className="errors">{errors.cook_time}</p>
                  )}
                </div>
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
              <div className="error-container">
                {errors.serving_size && (
                  <p className="errors">{errors.serving_size}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="bottom-left">
            <div className="bottom-left-labels">
              <div className="bottom-label-left">
                <label>Measurements</label>
              </div>
              <div className="bottom-label-right">
                <label>Ingredients</label>
              </div>
            </div>
            <div className="border">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="bottom-left-inputs">
                  <div className="input">
                    <input
                      type="text"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleFieldChange(index, "quantity", e.target.value)
                      }
                      placeholder="(e.g., 1 cup chopped)"
                      className="quantity-input"
                    />
                  </div>
                  <div className="input">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleFieldChange(index, "ingredient", e.target.value)
                      }
                      placeholder="(e.g., carrots)"
                      className="ingredient-input"
                    />
                  </div>
                </div>
              ))}
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
          <div className="bottom-right">
            <div className="bottom-right-label">
              <label>Instructions</label>
            </div>
            <div className="border">
              {instructions.map((instruction, index) => (
                <div key={index} className="bottom-right-inputs">
                  <div className="input">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) =>
                        handleFieldChange(index, "instruction", e.target.value)
                      }
                      placeholder={`Step ${index + 1}`}
                      className="instruction-input"
                    />
                    {errors.instructions && (
                      <p className="errors">{errors.instructions}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="add-more">
                <button type="button" onClick={handleSteps}>
                  Add Step
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="submit">
          <button type="submit" disabled={isLoading}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeFormPage;
