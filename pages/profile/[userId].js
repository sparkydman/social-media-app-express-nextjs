import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Edit from "@material-ui/icons/Edit";
import withStyles from "@material-ui/core/styles/withStyles";
import { authInitialProps } from "../../lib/auth";
import {
  getUser,
  getPostsByUser,
  deletePost,
  likePost,
  unLikePost,
  addComment,
  delComment,
} from "../../lib/api";
import Link from "next/link";
import FollowUser from "../../components/profile/FollowUser";
import DeleteUser from "../../components/profile/DeleteUser";
import ProfileTabs from "../../components/profile/ProfileTabs";
import format from "date-fns/format";

class Profile extends React.Component {
  state = {
    user: null,
    posts: [],
    isAuth: false,
    isFollowing: false,
    isLoading: true,
    isDeletingPost: false,
  };

  componentDidMount() {
    const { userId, auth } = this.props;
    getUser(userId).then(async (user) => {
      const isAuth = auth.user._id === userId;
      const isFollowing = this.checkFollow(auth, user);
      const posts = await getPostsByUser(userId);
      this.setState({ user, isAuth, isLoading: false, isFollowing, posts });
    });
  }

  checkFollow = (auth, user) => {
    return (
      user.following.findIndex((following) => following._id === auth.user._id) >
      -1
    );
  };

  toggleFollow = (sendRequest) => {
    const { userId, auth } = this.props;
    const { isFollowing } = this.state;

    sendRequest(userId).then(() =>
      this.setState({ isFollowing: !isFollowing })
    );
  };

  handleDeletePost = (delPost) => {
    this.setState({ isDeletingPost: true });
    deletePost(delPost._id)
      .then((postData) => {
        const postIndex = this.state.posts.findIndex(
          (post) => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          ...this.state.posts.slice(postIndex + 1),
        ];
        this.setState({
          posts: updatedPosts,
          isDeletingPost: false,
        });
      })
      .catch((err) => {
        this.setState({ isDeletingPost: false });
        console.log(err);
      });
  };

  handleToggleLike = (post) => {
    const { auth } = this.props;

    const isPostLiked = post.likes.includes(auth.user._id);
    const sendRequest = isPostLiked ? unLikePost : likePost;
    sendRequest(post._id)
      .then((postData) => {
        const postIndex = this.state.posts.findIndex(
          (post) => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1),
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch((err) => console.log(err));
  };

  handleAddComment = (postId, text) => {
    const comment = { text };
    addComment(postId, comment)
      .then((postData) => {
        const postIndex = this.state.posts.findIndex(
          (post) => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1),
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch((err) => console.log(err));
  };

  handleDelComment = (postId, comment) => {
    delComment(postId, comment)
      .then((postData) => {
        const postIndex = this.state.posts.findIndex(
          (post) => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1),
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { classes, auth } = this.props;
    const {
      isLoading,
      user,
      posts,
      isAuth,
      isFollowing,
      isDeletingPost,
    } = this.state;
    // console.log(isFollowing);
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          className={classes.title}
          color="primary"
        >
          Profile
        </Typography>
        {isLoading ? (
          <div className={classes.progressContainer}>
            <CircularProgress
              className={classes.progress}
              size={55}
              thickness={5}
            />
          </div>
        ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} className={classes.bigAvatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />
              {isAuth ? (
                <ListItemSecondaryAction>
                  <Link
                    href="/edit-profile/[userId]"
                    as={`/edit-profile/${user._id}`}
                  >
                    <a>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </a>
                  </Link>
                  <DeleteUser user={user} />
                </ListItemSecondaryAction>
              ) : (
                <FollowUser
                  isFollowing={isFollowing}
                  toggleFollow={this.toggleFollow}
                />
              )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={user.about}
                secondary={`Joined: ${format(
                  new Date(user.createdAt),
                  "dd-MMM-yyyy"
                )}`}
              />
            </ListItem>

            <ProfileTabs
              auth={auth}
              posts={posts}
              user={user}
              isDeletingPost={isDeletingPost}
              handleDeletePost={this.handleDeletePost}
              handleToggleLike={this.handleToggleLike}
              handleAddComment={this.handleAddComment}
              handleDelComment={this.handleDelComment}
            />
          </List>
        )}
      </Paper>
    );
  }
}

const styles = (theme) => ({
  root: {
    padding: theme.spacing(1) * 3,
    marginTop: theme.spacing(1) * 5,
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: 600,
    },
  },
  title: {
    color: theme.palette.openTitle,
  },
  progress: {
    margin: theme.spacing(1) * 2,
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
});

Profile.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Profile);
