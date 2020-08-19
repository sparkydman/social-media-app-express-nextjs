import React, { Component } from "react";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import AccountBox from "@material-ui/icons/AccountBox";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";
import { getUserFeed, followUser } from "../../lib/api";
import { authInitialProps } from "../../lib/auth";

class UserFeed extends Component {
  state = {
    users: [],
    openSuccess: false,
    followingMsg: "",
  };

  componentDidMount() {
    const { auth } = this.props;

    getUserFeed(auth.user._id)
      .then((users) => {
        // console.log(users);
        this.setState({ users });
      })
      .catch((err) => console.log(err));
  }

  handleFollow = (user, index) => {
    followUser(user._id)
      .then((user) => {
        const updatedUsers = [
          ...this.state.users.slice(0, index),
          ...this.state.users.slice(index + 1),
        ];
        this.setState({
          users: updatedUsers,
          openSuccess: true,
          followingMsg: `You are now following ${user.name}`,
        });
      })
      .catch((err) => console.log(err));
  };

  handleClose = () => this.setState({ openSuccess: false });

  render() {
    const { classes } = this.props;
    const { users, openSuccess, followingMsg } = this.state;

    // console.log(users);
    return (
      <div>
        <Typography type="title" component="h2" variant="h6" align="center">
          Browser User
        </Typography>
        <Divider />
        <List>
          {users.map((user, i) => (
            <span key={user._id}>
              <ListItem>
                <ListItemAvatar className={classes.avatar}>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <ListItemSecondaryAction>
                  <Link href="/profile/[userId]" as={`/profile/${user._id}`}>
                    <IconButton
                      variant="contained"
                      color="secondary"
                      className={classes.viewButton}
                    >
                      <AccountBox />
                    </IconButton>
                  </Link>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleFollow(user, i)}
                  >
                    Follow
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </span>
          ))}
        </List>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={openSuccess}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={<span className={classes.snack}>{followingMsg}</span>}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  follow: {
    right: theme.spacing(1) * 2,
  },
  snack: {
    color: theme.palette.primary.light,
  },
  viewButton: {
    verticalAlign: "middle",
  },
});

UserFeed.getInitialProps = authInitialProps(true);

export default withStyles(styles)(UserFeed);
