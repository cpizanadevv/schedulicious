import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as commentActions from "../../redux/comments";
import "./Delete.scss";

function RecipeDelete(commentId) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const handleDeleteRecipe = (e) => {
    e.preventDefault();

    dispatch(commentActions.deleteComment(Number(commentId.id)));
    dispatch(commentActions.getAllRecipes());
    closeModal();
  };
  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

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
