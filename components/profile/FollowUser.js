import Button from "@material-ui/core/Button";
import { followUser, unFollowUser } from "../../lib/api";

const FollowUser = ({ isFollowing, toggleFollow }) => {
  const request = isFollowing ? followUser : unFollowUser;
  return (
    <Button
      variant="contained"
      color={isFollowing ? "secondary" : "primary"}
      onClick={() => toggleFollow(request)}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowUser;
