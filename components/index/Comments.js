import React, { Component } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Avatar from "@material-ui/core/Avatar";
import Delete from "@material-ui/icons/Delete";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";
import formatDistance from "date-fns/formatDistance";

class Comments extends Component {
  state = {
    text: "",
  };

  handleChange = (event) => {
    this.setState({ text: event.target.value });
  };

  showComment = (comment) => {
    const { postId, auth, classes, handleDelComment } = this.props;

    const isCommentCreator = comment.postedBy._id === auth.user._id;

    return (
      <div>
        <Link
          href={"/profile/[userId]"}
          as={`/profile/${comment.postedBy._id}`}
        >
          <a>{comment.postedBy.name}</a>
        </Link>
        <br />
        {comment.text}
        <span className={classes.commentDate}>
          {formatDistance(new Date(comment.createdAt), new Date(), {
            addSuffix: true,
          })}
          {isCommentCreator && (
            <Delete
              color="secondary"
              className={classes.commentDelete}
              onClick={() => handleDelComment(postId, comment)}
            />
          )}
        </span>
      </div>
    );
  };

  handleSubmit = (event) => {
    const { text } = this.state;
    const { postId, handleAddComment } = this.props;

    event.preventDefault();
    handleAddComment(postId, text);
    this.setState({ text: "" });
  };

  render() {
    const { auth, comments, classes, postId } = this.props;
    const { text } = this.state;
    return (
      <div className={classes.comments}>
        {/* comment input */}
        <CardHeader
          avatar={
            <Avatar className={classes.smallAvatar} src={auth.user.avatar} />
          }
          title={
            <form onSubmit={this.handleSubmit}>
              <FormControl margin="normal" fullWidth required>
                <InputLabel htmlFor={`add-comment-${postId}`}>
                  Add comments
                </InputLabel>
                <Input
                  id={`add-comment-${postId}`}
                  name="text"
                  placeholder="Reply to this post"
                  value={text}
                  onChange={this.handleChange}
                />
              </FormControl>
            </form>
          }
          className={classes.cardHeader}
        />
        {/* comments */}
        {comments.map((comment) => (
          <CardHeader
            key={comment._id}
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={comment.postedBy.avatar}
              />
            }
            title={this.showComment(comment)}
            className={classes.cardHeader}
          />
        ))}
      </div>
    );
  }
}

const styles = (theme) => ({
  comments: {
    backgroundColor: "rgba(11, 61, 130, 0.06)",
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  smallAvatar: {
    margin: 10,
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em",
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer",
  },
});

export default withStyles(styles)(Comments);
