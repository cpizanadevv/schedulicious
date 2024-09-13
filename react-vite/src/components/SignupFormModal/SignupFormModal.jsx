import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import LoginFormModal from "../LoginFormModal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal, setModalContent } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const handleClick = () => {
    closeModal()
    setModalContent(<LoginFormModal/>);
  }
  return (
    <div className="signup-modal">
    <div className="site-name">
        <h1 className="signlog">Scheduliscious</h1>
    </div>
      <h1>Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit} className="sign-up-form">
        <label>
          Email
        </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        {errors.email && <p>{errors.email}</p>}
        <label>
          Username
        </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        {errors.username && <p>{errors.username}</p>}
        <label>
          Password
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
        </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit" className="signup-button">Sign Up</button>
        <div className="to-login">
          <a onClick={handleClick}>Already a user? Log in</a>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
