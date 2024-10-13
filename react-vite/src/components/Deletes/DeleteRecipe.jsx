import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as recipeActions from "../../redux/recipe";
import "./Delete.scss";
import { useNavigate } from "react-router-dom";

function RecipeDelete(recipeId) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  // console.log("id", Number(recipeId.id));
  const handleDeleteRecipe = (e) => {
    e.preventDefault();

    dispatch(recipeActions.deleteRecipe(Number(recipeId.id)));
    dispatch(recipeActions.getAllRecipes());
    navigate('recipes')
    closeModal();
  };
  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  // console.log("DELETE",schedule);
  return (
    <div className="delete-modal">
      <div className="site-name">
        <h1 className="signlog">Scheduliscious</h1>
      </div>
      <h2>Are you sure you want to delete this recipe?</h2>
      <div className="delete-schedule-bttns">
        <button onClick={handleDeleteRecipe}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default RecipeDelete;
