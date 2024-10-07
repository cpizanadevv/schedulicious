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
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
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
              {user.profile_img ? (<li className="profile-thumb">{user.profile_img}</li>):(<li className="profile-thumb">{user.username[0]}</li>)}
              <li>Hello, {user.username}</li>
              
              <li className="menu-item">
                <NavLink to="/" className="menu-links">Home</NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/recipes" className="menu-links">Recipes</NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/create-recipe" className="menu-links">Create Recipe</NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/schedule" className="menu-links">My Schedule</NavLink>
              </li>
              <li id="logout" className="menu-item" onClick={logout}>Log Out
              </li>
          
          
            </>
          ) : (
            <>
              <li className="menu-item"><NavLink to="/recipes" className="menu-links">Recipes</NavLink></li>
              <OpenModalMenuItem 
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
