
// import { FaSearch } from "react-icons/fa";

import { useSelector } from "react-redux";

//             <FaSearch />
//             <input type="search" placeholder="Search for a Recipe" />

function LandingPage(){
    const user = useSelector((state) => state.session.user)

    return(
        <div className="landing">
            <div className="landing-banner">
                <img src="" alt="" />
            </div>
            <div className="join">
                <button>Join</button>
            </div>
            <div>
                {user ?(
                    <div>

                    </div>
                ):(
                    <div>

                    </div>
                )}
            </div>
            

        </div>
    )
}

export default LandingPage;