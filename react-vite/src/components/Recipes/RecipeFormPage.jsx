import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as recipeActions from "../../redux/recipe";
import { useNavigate } from "react-router-dom";

function RecipeFormPage() {
  const currentUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [meal_name, setMealName] = useState("");
  const [course_type, setCourse] = useState("");
  const [prep_time, setPrepTime] = useState("");
  const [cook_time, setCookTime] = useState("");
  const [serving_size, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
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

    const newRecipe = {
      user_id: currentUser,
      meal_name,
      prep_time,
      cook_time,
      serving_size,
      calories,
      file,
    };
    const data = await dispatch(recipeActions.addRecipe(newRecipe));
    if (data.img) {
      navigate(`/pin/${data.id}`); //nav to ViewPin
    } else {
      alert("Error uploading file");
    }
  };
  const handleReplaceImage = () => {
    imageInputRef.current.click();
  };

  const handlePublish = () => {
    handleSubmit(new Event("submit", { cancelable: true, bubbles: true }));
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
         {isImageUploaded && (
                    <button className='publish-button-header' onClick={handlePublish}>
                        Publish
                    </button>
                )}
      <form>
        <div className="inputs">
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
          <div className="text-inputs">
            <input
              type="text"
              value={meal_name}
              onChange={(e) => setMealName(e.target.value)}
            />
            <input
              type="text"
              value={course_type}
              onChange={(e) => setCourse(e.target.value)}
            />
            <input
              type="text"
              value={prep_time}
              onChange={(e) => setPrepTime(e.target.value)}
            />
            <input
              type="text"
              value={cook_time}
              onChange={(e) => setCookTime(e.target.value)}
            />
            <input
              type="text"
              value={serving_size}
              onChange={(e) => setServingSize(e.target.value)}
            />
            <input
              type="text"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default RecipeFormPage;
