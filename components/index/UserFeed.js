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

class UserFeed extends Component {
  render() {
    return <div>User feed</div>;
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

export default withStyles(styles)(UserFeed);
