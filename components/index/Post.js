import React, { PureComponent } from "react";
import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Comment from "@material-ui/icons/Comment";
import DeleteTwoTone from "@material-ui/icons/DeleteTwoTone";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";
import formatDistance from "date-fns/formatDistance";

import Comments from "./Comments";
class Post extends PureComponent {
  state = {
    isLiked: false,
    numLikes: 0,
    comments: [],
  };

  componentDidMount() {
    this.setState({
      isLiked: this.chekLiked(this.props.post.likes),
      numLikes: this.props.post.likes.length,
      comments: this.props.post.comments,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post.likes.length !== this.props.post.likes.length) {
      this.setState({
        isLiked: this.chekLiked(this.props.post.likes),
        numLikes: this.props.post.likes.length,
      });
    }
    if (prevProps.post.comments.length !== this.props.post.comments.length) {
      this.setState({
        comments: this.props.post.comments,
      });
    }
  }

  chekLiked = (likes) => likes.includes(this.props.auth.user._id);

  render() {
    const {
      classes,
      post,
      auth,
      isDeleteingPost,
      handleDeletePost,
      handleToggleLike,
      handleAddComment,
      handleDelComment,
    } = this.props;
    const { isLiked, numLikes, comments } = this.state;
    const isPoster = post.postedBy._id === auth.user._id;

    return (
      <Card className={classes.card}>
        {/* post header */}
        <CardHeader
          avatar={<Avatar src={post.postedBy.avatar} />}
          action={
            isPoster && (
              <IconButton
                disabled={isDeleteingPost}
                onClick={() => handleDeletePost(post)}
              >
                <DeleteTwoTone color="secondary" />
              </IconButton>
            )
          }
          title={
            <Link href="/profile/[userId]" as={`/profile/${post.postedBy._id}`}>
              <a>{post.postedBy.name}</a>
            </Link>
          }
          subheader={formatDistance(new Date(post.createdAt), new Date(), {
            addSuffix: true,
          })}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant="body1" className={classes.text}>
            {post.text}
          </Typography>
          {/* post image */}
          {post.image && (
            <div className={classes.imageContainer}>
              <img className={classes.image} src={post.image} />
            </div>
          )}
        </CardContent>

        {/* post action */}
        <CardActions>
          <IconButton
            className={classes.button}
            onClick={() => handleToggleLike(post)}
          >
            <Badge badgeContent={numLikes} color="secondary">
              {isLiked ? (
                <Favorite className={classes.favoriteIcon} />
              ) : (
                <FavoriteBorder className={classes.favoriteIcon} />
              )}
            </Badge>
          </IconButton>
          <IconButton className={classes.button}>
            <Badge badgeContent={comments.length} color="primary">
              <Comment className={classes.commentIcon} />
            </Badge>
          </IconButton>
        </CardActions>
        <Divider />

        {/* comments area */}
        <Comments
          auth={auth}
          postId={post._id}
          comments={comments}
          handleAddComment={handleAddComment}
          handleDelComment={handleDelComment}
        />
      </Card>
    );
  }
}

const styles = (theme) => ({
  card: {
    marginBottom: theme.spacing(1) * 3,
  },
  cardContent: {
    backgroundColor: "white",
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: "rgba(11, 61, 130, 0.06)",
  },
  imageContainer: {
    textAlign: "center",
    padding: theme.spacing(1),
  },
  image: {
    height: 200,
  },
  favoriteIcon: {
    color: theme.palette.favoriteIcon,
  },
  commentIcon: {
    color: theme.palette.commentIcon,
  },
});

export default withStyles(styles)(Post);
