import { useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from '../../redux/recipe'

function RecipeFormPage() {
  const currentUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [meal_name, setMealName] = useState("");
  const [course_type, setCourse] = useState("");
  const [prep_time, setPrepTime] = useState("");
  const [cook_time, setCookTime] = useState("");
  const [serving_size, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const imageInputRef = useRef(null);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsImageUploaded(true);
        setFile(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    if (title.trim().length < 1) {
        setTitleError("A title is required.");
        return;
    }

    if (link && !isValidURL(link)) {
        setLinkError("Please enter a valid URL.");
        return;
    }
    const newRecipe = {
            user_id : currentUser,
            meal_name,
            prep_time,
            cook_time,
            serving_size,
            calories,
            file
    }
    const data = await dispatch(recipeActions.addRecipe(newRecipe))
    if (data.img) {
        navigate(`/pin/${data.id}`); //nav to ViewPin
    } else {
        alert("Error uploading file");
    }
  }
  const isValidURL = (string) => {
      try {
          new URL(string);
          return true;
      } catch (err) {
          return false;
      }
  };
  const handleReplaceImage = () => {
      imageInputRef.current.click();
  };

  const handlePublish = () => {
      handleSubmit(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const handleDragOver = (e) => {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Prevent event bubbling
  };

  const handleDrop = (e) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent event bubbling
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
};

  return (
    <div className="create-recipe">
      <form>
        <div
          className="choose-file"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            ref={imageInputRef}
            style={{ display: "none" }}
          />
          {!isImageUploaded && (
            <button
              type="button"
              className="choose-file-button"
              onClick={() => imageInputRef.current.click()}
            >
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
              Choose a file or drag and drop it here
            </button>
          )}
          {isImageUploaded && (
            <div className="uploaded-image-container">
              <img src={imageSrc} alt="Uploaded" />
              <span></span>
              <button
                type="button"
                className="replace-file-button"
                onClick={handleReplaceImage}
              >
                Replace Image
              </button>
            </div>
          )}
        </div>
        <div>
            <input type="text" value={meal_name}/>
            <input type="text" value={course_type}/>
            <input type="text" value={prep_time}/>
            <input type="text" value={cook_time}/>
            <input type="text" value={serving_size}/>
            <input type="text" value={calories} />
        </div>
      </form>
    </div>
  );
}

export default RecipeFormPage;
