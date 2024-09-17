import { useState } from "react";

function Scraper() {
  const [url, setUrl] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  return (
    <div className="">
        <input type="url" placeholder="url"/>
    </div>
    // <div className="create-recipe">
    //   <div className="banner">
    //     <img
    //       src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/CreateRecipe.png"
    //       alt="Create recipe banner"
    //     />
    //   </div>
    //   <div className="web-scraper">
    //     <h4>Have a recipe from another site?</h4>
    //     <Scraper />
    //   </div>

    //   <form onSubmit={handleSubmit} encType="multipart/form-data">
    //     <div className="inputs">
    //       <div className="img">
    //         {imagePreview && (
    //           <img
    //             className="img-preview"
    //             src={imagePreview}
    //             alt="Image Preview"
    //           />
    //         )}
    //         <input
    //           className="img-input"
    //           type="file"
    //           name="image"
    //           accept="image/*"
    //           onChange={updateImage}
    //           required
    //         />
    //         {errors.img && <p className="errors">{errors.img}</p>}
    //       </div>
    //       <div className="text-inputs">
    //         <div className="input">
    //           <div className="labels">
    //             <label>Recipe Name</label>
    //           </div>
    //           <input
    //             type="text"
    //             value={mealName}
    //             placeholder="Name (e.g., Posole Verde)"
    //             onChange={(e) => setMealName(e.target.value)}
    //           />
    //           {errors.meal_name && <p className="errors">{errors.mealName}</p>}
    //         </div>
    //         <div className="input">
    //           <div className="labels">
    //             <label>Tags</label>
    //           </div>
    //           <input
    //             type="text"
    //             value={tag}
    //             onChange={(e) => setTag(e.target.value)}
    //             placeholder="(e.g., nuts)"
    //             onKeyDown={(e) => {
    //               if (e.key === "Enter") {
    //                 e.preventDefault();
    //                 handleTags();
    //               }
    //             }}
    //           />

    //           {errors.tags && <p className="errors">{errors.tags}</p>}
    //           <div className="tag-list">
    //             {tags.length > 0 &&
    //               tags.map((t, index) => (
    //                 <div key={index} className="tag-item">
    //                   {t}
    //                   <span
    //                     className="delete-tag"
    //                     onClick={() => handleDeleteTag(index)}
    //                   >
    //                     x
    //                   </span>
    //                 </div>
    //               ))}
    //           </div>
    //         </div>
    //         <div className="courses">
    //           <label>Course Type</label>
    //           <select
    //             className="course-select"
    //             value={courseType}
    //             onChange={(e) => setCourse(e.target.value)}
    //           >
    //             <option value="">Select Course Type</option>
    //             <option value="Breakfast">Breakfast</option>
    //             <option value="Lunch">Lunch</option>
    //             <option value="Dinner">Dinner</option>
    //             <option value="Snack">Snack</option>
    //             <option value="Drink">Drink</option>
    //           </select>
    //           {errors.course_type && (
    //             <p className="errors">{errors.courseType}</p>
    //           )}
    //         </div>
    //         <div className="times">
    //           <div className="labels">
    //             <label>Prep Time</label>
    //           </div>
    //           <div className="input">
    //             <input
    //               type="text"
    //               value={prepTime}
    //               placeholder="(e.g., 10 minutes)"
    //               onChange={(e) => setPrepTime(e.target.value)}
    //             />
    //             {errors.prepTime && <p className="errors">{errors.prepTime}</p>}
    //           </div>
    //           <div className="input">
    //             <div className="labels">
    //               <label>Cook Time</label>
    //             </div>
    //             <input
    //               type="text"
    //               value={cookTime}
    //               placeholder="(e.g., 10 minutes)"
    //               onChange={(e) => setCookTime(e.target.value)}
    //             />
    //             {errors.cookTime && <p className="errors">{errors.cookTime}</p>}
    //           </div>
    //         </div>
    //         <div className="input">
    //           <div className="labels">
    //             <label>Serving Size</label>
    //           </div>
    //           <input
    //             type="text"
    //             value={servingSize}
    //             placeholder="(e.g., 4)"
    //             onChange={(e) => setServingSize(e.target.value)}
    //           />
    //           {errors.serving_size && (
    //             <p className="errors">{errors.servingSize}</p>
    //           )}
    //         </div>
    //       </div>
    //     </div>

    //     <div className="textareas">
    //       <div className="recipe-left">
    //         <div className="recipe-left-labels">
    //           <div>
    //             <label>Measurements</label>
    //           </div>
    //           <div>
    //             <label>Ingredients</label>
    //           </div>
    //         </div>
    //         <div className="border">
    //           <div>
    //             {ingredients.map((ingredient, index) => (
    //               <div key={index} className="recipe-left-inputs">
    //                 <input
    //                   type="text"
    //                   value={ingredient.quantity}
    //                   onChange={(e) =>
    //                     handleFieldChange(index, "quantity", e.target.value)
    //                   }
    //                   placeholder="(e.g., 1 cup)"
    //                   className="quantity-input"
    //                 />
    //                 <input
    //                   type="text"
    //                   value={ingredient.name}
    //                   onChange={(e) =>
    //                     handleFieldChange(index, "ingredient", e.target.value)
    //                   }
    //                   placeholder="(e.g., flour)"
    //                   className="ingredient-input"
    //                 />
    //               </div>
    //             ))}
    //           </div>
    //           {errors.ingredient && (
    //             <p className="errors">{errors.ingredient}</p>
    //           )}
    //           <div className="add-more">
    //             <button type="button" onClick={addIngredientField}>
    //               Add More
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="recipe-right">
    //         <div className="recipe-right-label">
    //           <label>Instructions</label>
    //         </div>
    //         <div className="border">
    //           <div className=".recipe-left-inputs">
    //             {instructions.map((instruction, index) => (
    //               <div key={index}>
    //                 <input
    //                   type="text"
    //                   value={instruction}
    //                   className="instructions"
    //                   onChange={(e) =>
    //                     handleFieldChange(index, "instruction", e.target.value)
    //                   }
    //                   placeholder={`Step ${
    //                     index + 1
    //                   }, (e.g., Thinly slice onions)`}
    //                 />
    //               </div>
    //             ))}
    //           </div>
    //           <div className="error-container">
    //             {errors.instructions && (
    //               <p className="error">{errors.instructions}</p>
    //             )}
    //           </div>
    //           <div className="add-more">
    //             <button type="button" onClick={handleSteps}>
    //               Add Step
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="submit">
    //       <button type="submit">Submit</button>
    //     </div>
    //   </form>
    // </div>
  );
}

export default Scraper;
