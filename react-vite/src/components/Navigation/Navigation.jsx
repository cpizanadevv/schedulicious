import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

function Navigation() {
  return (
    <ul className="nav">
      <li className="nav-buttons">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/recipes">Recipes</NavLink>
          <ProfileButton />
      </li>
      <li className="site-name">
          <h1>Scheduliscious</h1>
      </li>
      <li className="social-links">
            <a href="https://www.linkedin.com/in/cpizanadevv/" className="linkedIn"><FaLinkedin/></a>
            <a href="https://github.com/cpizanadevv" className="gitHub"><FaGithub /></a>
      </li>
    </ul>
  );
}

export default Navigation;
