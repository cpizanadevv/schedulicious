import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import SignupFormModal from "../SignupFormModal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal, setModalContent } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };
  const handleDemo = async (e) => {
    e.preventDefault();

    setErrors({});
    return await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  
  const handleClick = () => {
    closeModal()
    setModalContent(<SignupFormModal/>);
  }

  return (
    <div className="login-modal">
    <div className="site-name">
        <h1 className="signlog">Scheduliscious</h1>
    </div>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
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
          Password
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.password && <p>{errors.password}</p>}
        <div className="login-buttons">
          <button type="submit">Log In</button>
          <button onClick={handleDemo}>Demo User</button>
        </div>
        <div className="to-signup">
          <a onClick={handleClick}>Not a user yet? Join today!</a>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
