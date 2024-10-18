
export const validateRecipeForm = (recipeData, srcForm) => {
    const errs = {};

    if (srcForm === "update" && recipeData.img === null) {
        
    } else {
        if (!recipeData.img || !recipeData.imagePreview) {
            errs.img = "An image is required.";
        }
        if (recipeData.img && recipeData.img.name) {
            const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.gif'];
            let validExtension = false;
            for (let ext of ALLOWED_EXTENSIONS) {
                if (recipeData.img.name.toLowerCase().endsWith(ext)) {
                    validExtension = true;
                    break;
                }
            }
            if (!validExtension) {
                errs.img = "Image filetype must be one of 'pdf', 'png', 'jpg', 'jpeg', or 'gif'.";
            }
        }
    }

    if (!recipeData.meal_name) {
        errs.meal_name = "Recipe Name is required.";
    }
    if (recipeData.meal_name.length < 2 || recipeData.meal_name.length > 200) {
        errs.meal_name = "Field must be between 2 and 200 characters long."
    }

    if (!recipeData.course_type) {
      errs.course_type = "Course Type is required.";
    }

    if (!recipeData.prep_time || recipeData.prep_time.length < 1) {
      errs.prep_time = "Prep Time is required.";
    }
    if (recipeData.prep_time.length < 2 || recipeData.prep_time.length > 200) {
        errs.prep_time = "Field must be between 2 and 200 characters long."
    }

    if (!recipeData.cook_time || recipeData.cook_time.length < 1) {
      errs.cook_time = "Cook Time is required.";
    }
    if (recipeData.cook_time.length < 2 || recipeData.cook_time.length > 200) {
        errs.cook_time = "Field must be between 2 and 200 characters long."
    }

    if (!recipeData.serving_size || recipeData.serving_size < 0) {
      errs.serving_size = "Serving size is required.";
    }
    const servingSizeValue = parseInt(recipeData.serving_size, 10);
    if (isNaN(servingSizeValue)) {
        errs.serving_size = "Serving size needs to be a whole number."
    }

    if (
        recipeData.ingredients.length < 1 ||
        recipeData.ingredients.some((ing) => {
            if (ing.quantity.trim() === "" || ing.name.trim() === "") {
                return true;
            }
            return false;
        })
    ) {
      errs.ingredient = "At least one ingredient with quantity is required.";
    }

    if (recipeData.instructions.length === 0 || recipeData.instructions[0] == '') {
      errs.instructions = "At least one instruction is required.";
    }

    return errs;
}
