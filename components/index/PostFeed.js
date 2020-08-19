import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import NewPost from "./NewPost";
import Post from "./Post";

import {
  addPost,
  getPostFeed,
  deletePost,
  likePost,
  unLikePost,
} from "../../lib/api";
class PostFeed extends Component {
  state = {
    posts: [],
    text: "",
    image: "",
    isAddingPost: false,
    isDeletingPost: false,
  };

  componentDidMount() {
    this.postForm = new FormData();
    this.getPosts();
  }

  getPosts = () => {
    const { auth } = this.props;

    getPostFeed(auth.user._id).then((posts) => {
      this.setState({
        posts,
      });
    });
  };

  handleChange = (event) => {
    let inputValues;
    if (event.target.name === "image") {
      inputValues = event.target.files[0];
    } else {
      inputValues = event.target.value;
    }
    this.postForm.set(event.target.name, inputValues);
    this.setState({ [event.target.name]: inputValues });
  };

  handleAddPost = () => {
    const { auth } = this.props;
    this.setState({ isAddingPost: true });
    addPost(auth.user._id, this.postForm)
      .then((postData) => {
        const updatedPost = [postData, ...this.state.posts];
        this.setState({
          posts: updatedPost,
          isAddingPost: false,
          text: "",
          image: "",
        });
        this.postForm.delete("image");
      })
      .catch((err) => {
        this.setState({ isAddingPost: false });
        console.log(err);
      });
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

  render() {
    const { classes, auth } = this.props;
    const { posts, text, image, isAddingPost, isDeletingPost } = this.state;
    return (
      <div className={classes.root}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          color="primary"
          className={classes.title}
        >
          Post Feed
        </Typography>
        <NewPost
          auth={auth}
          text={text}
          image={image}
          isAddingPost={isAddingPost}
          handleChange={this.handleChange}
          handleAddPost={this.handleAddPost}
        />
        {posts.map((post) => (
          <Post
            key={post._id}
            auth={auth}
            post={post}
            isDeletingPost={isDeletingPost}
            handleDeletePost={this.handleDeletePost}
            handleToggleLike={this.handleToggleLike}
          />
        ))}
      </div>
    );
  }
}
const styles = (theme) => ({
  root: {
    paddingBottom: theme.spacing(1) * 2,
  },
  title: {
    padding: theme.spacing(1) * 2,
  },
});
export default withStyles(styles)(PostFeed);
