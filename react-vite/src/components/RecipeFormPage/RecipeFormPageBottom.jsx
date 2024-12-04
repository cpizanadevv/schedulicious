import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as recipeActions from "../../redux/recipe";
import * as ingActions from "../../redux/ingredient";
import "./RecipeFormPage.scss";
import { validateRecipeForm } from "./ValidatorUtils";

function RecipeFormBottom(){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    const [ingredients, setIngredients] = useState([{ quantity: "", name: "" }]);
    const [instructions, setInstructions] = useState([""]);

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

    return(
        <form>
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
    )
}

export default RecipeFormBottom;