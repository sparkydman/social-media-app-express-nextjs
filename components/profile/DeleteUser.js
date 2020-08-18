import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Delete from "@material-ui/icons/Delete";
import { deleteUser } from "../../lib/api";
import { signoutUser } from "../../lib/auth";

export class DeleteUser extends Component {
  state = {
    open: false,
    isDeleting: true,
  };
  handleDeleteUser = () => {
    const { user } = this.props;

    deleteUser(user._id)
      .then(() => signoutUser())
      .catch((err) => {
        this.setState({ isDeleting: false });
        console.log(err);
      });
  };

  handleOpen = () => this.setState({ open: true });
  handleClose = () => this.setState({ open: false });

  render() {
    const { open, isDeleting } = this.state;
    return (
      <div>
        <IconButton onClick={this.handleOpen} color="secondary">
          <Delete />
        </IconButton>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle color="primary">Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirm to delete your account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button color="secondary" onClick={this.handleDeleteUser}>
              {isDeleting ? "Confirm" : "Deleting"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteUser;
