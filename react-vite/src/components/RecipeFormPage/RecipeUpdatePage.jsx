import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import * as tagActions from "../../redux/tag";
import * as ingActions from "../../redux/ingredient";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { IoArrowBackCircle } from "react-icons/io5";
import LoadingModal from "../LoadingModal/LoadingModal";
import { validateRecipeForm } from "./ValidatorUtils";
import "./RecipeFormPage.scss";

function RecipeUpdate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const recipe = useSelector((state) => state.recipe.recipe);
  const user = useSelector((state) => state.session.user);

  const [isLoading, setIsLoading] = useState(false);
  const [mealName, setMealName] = useState("");
  const [courseType, setCourse] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [tags, setTags] = useState([""]);
  const [tag, setTag] = useState("");
  const [ingredients, setIngredients] = useState([{ quantity: "", name: "" }]);
  const [instructions, setInstructions] = useState([]);
  const [errors, setErrors] = useState({});
  const { closeModal, setModalContent } = useModal();
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    dispatch(recipeActions.getSingleRecipe(recipeId));
  }, [dispatch, recipeId]);

  useEffect(() => {
    if (isLoading) {
      setModalContent(<LoadingModal />);
    }
  }, [isLoading]);

  useEffect(() => {
    if (recipe && recipe.id === parseInt(recipeId)) {
      setMealName(recipe.meal_name || "");
      setCourse(recipe.course_type || "");
      setPrepTime(recipe.prep_time || "");
      setCookTime(recipe.cook_time || "");
      setServingSize(recipe.serving_size || "");
      setImagePreview(recipe.img || "");
      setTags(recipe.tags.map((tag) => tag.tag) || []);
      setIngredients(
        recipe.ingredients.map((ing) => ({
          quantity: ing.quantity,
          name: ing.ingredient_name,
        })) || [{ quantity: "", name: "" }]
      );
      setInstructions(recipe.instructions || [""]);
    }
  }, [recipe, recipeId]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // ?        Handling Image Update

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
    }else if(ingredients.length === 0){
      setIngredients([...ingredients, { quantity: "", name: "" }]);
    } else {
      setErrors({ ingredient: "Cannot be empty before adding more" });
    }
  };
  const removeEmptyIngredients = () => {
    if (ingredients.length === 1) {
      return;
    }

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
    }else if(instructions.length === 0){
      setInstructions([...instructions, ""]);
    } else {
      // handle the case when the last instruction is not filled
      setErrors({ instructions: "Cannot be empty before adding more" });
    }
  };

  const removeEmptyInstructions = () => {
    const filteredInstructions = instructions.filter(
      (instruction) => {
        return instruction.trim() !== ""}
      );
    setInstructions(filteredInstructions);
    return filteredInstructions;
  };

  // Creates new input field
  const handleFieldChange = (index, field, value) => {
    if (field === "quantity" || field === "ingredient") {
      setHasUpdated(true);
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

    if (ingredients.length > 1) {
      removeEmptyIngredients();
    }

    let withDelimiter = "";
    if (instructions.length > 1) {
      const filteredInstructions = removeEmptyInstructions();
      withDelimiter = filteredInstructions.join(" | ");
    }
    const recipeData = {
      img: image,
      meal_name: mealName,
      course_type: courseType,
      prep_time: prepTime,
      cook_time: cookTime,
      serving_size: servingSize,
      instructions: withDelimiter || instructions[0],
      imagePreview,
      ingredients,
    };
    
    const errs = validateRecipeForm(recipeData, "update");
    
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const formData = new FormData();

    formData.append("img", image);
    formData.append("meal_name", mealName);
    formData.append("course_type", courseType);
    formData.append("prep_time", prepTime);
    formData.append("cook_time", cookTime);
    formData.append("serving_size", servingSize);
    formData.append("instructions", withDelimiter || instructions[0]);

    let notUpdated = true;
    for (let key of Object.keys(recipeData)) {
      if (key == "img" && image == null) {
        continue;
      } else if (key == "imagePreview") {
        continue;
      } else if (recipe[key] != recipeData[key]) {
        notUpdated = false;
        break;
      }
    }
    if (notUpdated) {
      navigate(`/recipes/${recipeId}`);
    }

    //  Dispatches to backend
    setIsLoading(true);
    const updateResponse = await dispatch(
      recipeActions.updateRecipe(formData, recipeId)
    );
    // Returns errs if any
    if (updateResponse.errors) {
      setErrors(updateResponse.errors);
      setIsLoading(false);
      closeModal();
      return;
    }

    // API call to grab nutritional values for macro calculation
    // dispatch(ingActions.deleteAllRecipeIngredients(recipeId))
    let tagsToAdd = tags.filter(tag => tag.trim() !== "");
    if (hasUpdated) {
      const deleteIngredients = async (recipe, recipeId) => {
        const arr = [];
        
        for (let ing of recipe.ingredients) {
          const response = await dispatch(
            ingActions.deleteRecipeIngredient({
              recipe_id: recipeId,
              ingredient_id: ing.ingredient_id,
            })
          );
          arr.push(response);
        }
        
        return arr;
      };
      await deleteIngredients(recipe, recipeId);

      const ingredientPromises = ingredients.map(async (ingredient) => {
        // if (recipe.ingredients.some((recIng) => recIng.name === ingredient.name)) {
        //   return null;
        // }

        try {
          const newIngredient = { name: ingredient.name };
          const addedIngredient = await dispatch(
            ingActions.addIngredient(newIngredient)
          );
    
          if (addedIngredient.errors) {
            setIsLoading(false);
            closeModal();
            return setErrors(prevErrors => [...prevErrors, ...addedIngredient.errors]);
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
      await Promise.all(ingredientPromises);
      // const ingredientResponses = await Promise.all(ingredientPromises);
      // tagsToAdd = [
      //   ...new Set(
      //     ingredientResponses.filter((name) => typeof name === "string")
      //   ),
      // ];
    }

    const tagPromises = tagsToAdd.map(async (tag) => {
      try { 
        const tagData = { tag: tag.trim() };
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
    setImage(null);
    setImagePreview("");
    setTags([""]);
    setIngredients([{ quantity: "", name: "" }]);
    setInstructions([""]);
    setIsLoading(false);
    closeModal();
    setHasUpdated(false);

    navigate(`/recipes/${recipeId}`);
  };

  const handleGoBack = () => {
    navigate(`/recipes/${recipeId}`);
  };
  return (
    <div>
      <div className="create-recipe">
        <div className="banner">
          <img
            src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/_08245fde-69e5-4b72-91a8-18791fc12061.jfif"
            alt="Create recipe banner"
          />
        </div>
        {recipe && (
          <div>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="recipe-form"
            >
              <div className="top">
                <div className="recipe-go-back" onClick={handleGoBack}>
                  <span className="tooltiptext">Back to recipe page</span>
                  <IoArrowBackCircle className="recipe-go-back-icon" />
                </div>
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
                      <span className="tooltiptext">Press Enter after every tag</span>
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
                              handleFieldChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            placeholder="(e.g., 1 cup)"
                            className="quantity-input"
                          />
                        </div>
                        <div className="input">
                          <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "ingredient",
                                e.target.value
                              )
                            }
                            placeholder="(e.g., flour)"
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
                          Step {index + 1}
                          <input
                            type="text"
                            value={instruction}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "instruction",
                                e.target.value
                              )
                            }
                            placeholder={`Step ${index + 1}`}
                            className="instruction-input"
                          />
                        </div>
                      </div>
                    ))}
                    {errors.instructions && (
                      <p className="errors">{errors.instructions}</p>
                    )}
                    <div className="add-more">
                      <button type="button" onClick={handleSteps}>
                        Add Step
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit">
                <button type="submit">Update Recipe</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeUpdate;
