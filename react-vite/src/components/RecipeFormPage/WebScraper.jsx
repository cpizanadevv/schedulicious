import { useState } from "react";

function Scraper(){
    const [ url, setUrl ] = useState('');
    const [ recipe, setRecipe ] = useState(null);
    const [error, setError] = useState('');

    

    return(
        <div className="">
            <input type="url" placeholder="url"/>
        </div>
    )
}

export default Scraper;