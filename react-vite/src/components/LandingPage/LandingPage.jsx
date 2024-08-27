// import { FaSearch } from "react-icons/fa";

import "./LandingPage.css";
import  landingPageBanner  from '../../../public/landingPageBanner.png'
import { NavLink } from "react-router-dom";

//             <FaSearch />
//             <input type="search" placeholder="Search for a Recipe" />
NavLink
function LandingPage() {
  return (
    <div className="landing">
      <div className="banner">
        <img src={landingPageBanner} />
      </div>
      
      <div className="join">
        <button>Join</button>
      </div>
        <div className="cards">
          <div className="card">
            <img src="" alt="" />
            <p>
              Welcome to our meal planning platform, where creating balanced,
              delicious meals is easier than ever. Tailor your meal plans to
              your unique dietary needs by adding allergens to avoid directly on
              your profile. Our smart system will ensure that your meal
              suggestions are safe, nutritious, and perfectly suited to your
              lifestyle.
            </p>
          </div>
          <div className="card">
            <p>
              Unleash your culinary creativity with our recipe creation tools.
              Share your favorite dishes with the community, and browse through
              a vast collection of recipes crafted by others. Whether you&#39;re
              looking for something quick and easy or a gourmet experience, our
              recipe library has something to inspire every meal.
            </p>
            <img src="" alt="" />
          </div>
          <div className="card">
            <img src="" alt="" />
            <p>
              Once you&#39;ve planned your meals for the week, our platform
              automatically generates a detailed grocery list for you. It&#39;s
              designed to make shopping a breeze by allowing you to remove any
              items you already have at home, ensuring you only buy what you
              need. Meal planning has never been this efficient!
            </p>
          </div>
        </div>
        <div className="best-recipes">
            <h2>Here are a few of our most liked recipes!</h2>
            <div className="recipe-cards">
                <div className="recipe-card">
                    <img src="" alt="" />
                    <h3>Title</h3>
                </div>
                <div className="recipe-card">
                    <img src="" alt="" />
                    <h3>Title</h3>
                </div>
                <div className="recipe-card">
                    <img src="" alt="" />
                    <h3>Title</h3>
                </div>
                <div className="recipe-card">
                    <img src="" alt="" />
                    <h3>Title</h3>
                </div>
            </div>
            <NavLink to={'/recipes'}>
                <button className="view-more">View more!</button>
            </NavLink>
            
        </div>
    </div>
  );
}

export default LandingPage;
