import "./LandingPage.css";
// import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import { useEffect, useState, useRef } from "react";
// import SearchBar from "../SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllRecipes } from "../../redux/recipe";

function LandingPage() {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="landing">
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/landingPageBanner.png" />
      </div>
      {user && (
        <div>
          <div>Welcome {user.username}</div>
          <div className="calendar-container">
          <h2>This week&apos;s meals</h2>
            <div className="calendar">
                <div className="days"></div>
                <div className="meal-container"></div>
            </div>
          </div>
          <div className="top-recipes"></div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
