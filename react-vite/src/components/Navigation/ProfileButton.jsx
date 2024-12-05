import { useState, useEffect, useRef } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import { thunkLogout } from "../../redux/session";
import { NavLink } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./NavMenu.scss";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent the event from bubbling up
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      <button onClick={toggleMenu} className="menu-button">
        <FiMenu />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              {user.profile_img ? (
                <li className="profile-thumb">{user.profile_img}</li>
              ) : (
                <li className="profile-thumb">{user.username[0]}</li>
              )}
              <li>Hello, {user.username}</li>

              <li className="menu-item" onClick={closeMenu}>
                <NavLink to="/" className="menu-links">Home</NavLink>
              </li>
              <li className="menu-item" onClick={closeMenu}>
                <NavLink to="/recipes" className="menu-links">Recipes</NavLink>
              </li>
              <li className="menu-item" onClick={closeMenu}>
                <NavLink to="/create-recipe" className="menu-links">Create Recipe</NavLink>
              </li>
              <li className="menu-item" onClick={closeMenu}>
                <NavLink to="/calendar" className="menu-links">Calendar</NavLink>
              </li>
              <li id="logout" className="menu-item" onClick={logout}>
                Log Out
              </li>
            </>
          ) : (
            <>
              <li className="menu-item" onClick={closeMenu}>
                <NavLink to="/" className="menu-links">Home</NavLink>
              </li>
              <li className="menu-item" onClick={closeMenu}>
                <NavLink to="/recipes" className="menu-links">Recipes</NavLink>
              </li>
              <div className="menu-item">
                <OpenModalMenuItem 
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </div>
              <div className="menu-item">
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </div>
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
