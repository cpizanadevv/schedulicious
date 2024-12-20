import "./LandingPage.css";
// import { NavLink } from "react-router-dom";
import OpenModalButton from '../OpenModalButton'
import SignupFormModal from "../SignupFormModal";
import { useEffect, useState, useRef } from "react";
// import SearchBar from "../SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllRecipes } from "../../redux/recipe";

function LandingPage() {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  // const dispatch = useDispatch()

  const user = useSelector((state) => state.session.user)

  // useEffect(() => {

  // })

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

  return (
    <div className="landing">
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/landingPageBanner.png" />
      </div>
      {/* <div className="landing-search">
        <SearchBar/>
      </div> */}

      <div className="cards">
        <div className="card">
          <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/allergens.jfif" alt="" />
          <p>
            Welcome to our meal planning platform, where creating balanced,
            delicious meals is easier than ever. Tailor your meal plans to your
            unique dietary needs by adding allergens to avoid directly on your
            profile. Our smart system will ensure that your meal suggestions are
            safe, nutritious, and perfectly suited to your lifestyle.
          </p>
        </div>
        <div className="card">
          <p>
            Unleash your culinary creativity with our recipe creation tools.
            Share your favorite dishes with the community, and browse through a
            vast collection of recipes crafted by others. Whether you&#39;re
            looking for something quick and easy or a gourmet experience, our
            recipe library has something to inspire every meal.
          </p>
          <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/recipe-creation.jfif" alt="" />
        </div>
        <div className="card">
          <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/Grocery+list.jfif" alt="" />
          <p>
            Once you&#39;ve planned your meals for the week, our platform
            automatically generates a detailed grocery list for you. It&#39;s
            designed to make shopping a breeze by allowing you to remove any
            items you already have at home, ensuring you only buy what you need.
            Meal planning has never been this efficient!
          </p>
        </div>
      </div>
      {!user && (
      <div className="join">
        <OpenModalButton
        modalComponent={<SignupFormModal/>}
        buttonText={'Join!'}
        onButtonClick={closeMenu}
        />
      </div>

      )}
      {/* <div className="best-recipes">
        <h2>Here are a few of our most liked recipes!</h2>
        <div className="landing-recipe-cards">
          <div className="landing-recipe-card">
            <img src="" alt="" />
            <h3>Title</h3>
          </div>
          <div className="landing-recipe-card">
            <img src="" alt="" />
            <h3>Title</h3>
          </div>
          <div className="landing-recipe-card">
            <img src="" alt="" />
            <h3>Title</h3>
          </div>
          <div className="landing-recipe-card">
            <img src="" alt="" />
            <h3>Title</h3>
          </div>
        </div>
        <NavLink to={"/recipes"}>
          <button className="view-more">View more!</button>
        </NavLink>
      </div> */}
    </div>
  );
}

export default LandingPage;
