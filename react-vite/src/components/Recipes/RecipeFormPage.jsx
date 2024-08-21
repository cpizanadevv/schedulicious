import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function RecipeFormPage() {
  const currentUser = useSelector((state) => state.session.user);
  const recipes = useSelector((state) => state.recipes.recipes);
  const [meal_name, setMealName] = useState("");
  const [course_type, setCourse] = useState("");
  const [prep_time, setPrepTime] = useState("");
  const [cook_time, setCookTime] = useState("");
  const [serving_size, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [img, setImg] = useState("");
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
      </form>
    </div>
  );
}

export default RecipeFormPage;
