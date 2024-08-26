// import { FaSearch } from "react-icons/fa";

import { useSelector } from "react-redux";
import "./LandingPage.css";

//             <FaSearch />
//             <input type="search" placeholder="Search for a Recipe" />

function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-banner">
        <img src="" alt="" />
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
            <img src="" alt="" />
            <p>
              Unleash your culinary creativity with our recipe creation tools.
              Share your favorite dishes with the community, and browse through
              a vast collection of recipes crafted by others. Whether you’re
              looking for something quick and easy or a gourmet experience, our
              recipe library has something to inspire every meal.
            </p>
          </div>
          <div className="card">
            <img src="" alt="" />
            <p>
              Once you’ve planned your meals for the week, our platform
              automatically generates a detailed grocery list for you. It’s
              designed to make shopping a breeze by allowing you to remove any
              items you already have at home, ensuring you only buy what you
              need. Meal planning has never been this efficient!
            </p>
          </div>
        </div>
    </div>
  );
}

export default LandingPage;
