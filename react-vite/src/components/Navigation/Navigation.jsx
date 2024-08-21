import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

function Navigation() {
  return (
    <ul className="nav">
      <li>
        <div className="nav-buttons">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/recipes">Recipes</NavLink>
          <ProfileButton />
        </div>
      </li>
      <li>
        <div className="site-name">
          <h1>Scheduliscious</h1>
        </div>
      </li>
      <li>
        <div className="social-links">
            <a href=""><FaLinkedin/></a>
            <a href=""><FaGithub /></a>
        </div>
      </li>
    </ul>
  );
}

export default Navigation;
