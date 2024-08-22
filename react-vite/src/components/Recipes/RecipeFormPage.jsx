import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as recipeActions from "../../redux/recipe";
// import 'RecipeFormPage.css'

function RecipeFormPage() {
  // const currentUser = useSelector((state) => state.session.user);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const [file, setFile] = useState(null);
  const [meal_name, setMealName] = useState("");
  const [course_type, setCourse] = useState("");
  const [prep_time, setPrepTime] = useState("");
  const [cook_time, setCookTime] = useState("");
  const [serving_size, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  // const [isImageUploaded, setIsImageUploaded] = useState(false);
  // const [imageSrc, setImageSrc] = useState("");
  // const imageInputRef = useRef(null);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const newRecipe = {
  //     user_id: currentUser,
  //     meal_name,
  //     prep_time,
  //     cook_time,
  //     serving_size,
  //     calories,
  //   };
  //   const data = await dispatch(recipeActions.addRecipe(newRecipe));
  // };

  return (
    <div className="create-recipe">
      <form>
        <div className="inputs">
          <div className="img">
            <input type="file" name="" id="" />
          </div>
          <div className="text-inputs">
            <div>
              <input
                type="text"
                value={meal_name}
                onChange={(e) => setMealName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                value={course_type}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                value={prep_time}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                value={cook_time}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                value={serving_size}
                onChange={(e) => setServingSize(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default RecipeFormPage;
