import { useEffect } from 'react';
import './LoadingModal.scss'


function LoadingModal() {
    
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    return(
        <div className="loading-modal">
            <h2>Loading</h2>
            <div className="loader"></div>

        </div>
    )
}

export default LoadingModal