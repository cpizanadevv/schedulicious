import { useSelector } from "react-redux";

function ProfilePage() {
  const userInfo = useSelector((state) => state.session.all);

  return (
    <div>
      {userInfo && (
        userInfo.map(() => (
            <div>
            
          <div className="banner">
            <img
              src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/recipeBanner.png"
              alt=""
            />
          </div>
        </div>
        ))
        
      )}
    </div>
  );
}
export default ProfilePage;
