import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUpload from "@material-ui/icons/CloudUpload";
import FaceTwoTone from "@material-ui/icons/FaceTwoTone";
import EditSharp from "@material-ui/icons/EditSharp";
import withStyles from "@material-ui/core/styles/withStyles";
import Router from "next/router";

import { authInitialProps } from "../../lib/auth";
import { authUser, updateUser } from "../../lib/api";

class EditProfile extends React.Component {
  state = {
    _id: "",
    name: "",
    email: "",
    about: "",
    avatar: "",
    previewImg: "",
    updatedUser: null,
    isSaving: true,
    openError: false,
    openSuccess: false,
    error: "",
    isLoading: true,
  };

  componentDidMount() {
    const { auth } = this.props;

    this.userForm = new FormData();
    authUser(auth.user._id)
      .then((user) => {
        this.setState({
          ...user,
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.error(err);
      });
  }

  handleChange = (event) => {
    let inputValues;
    if (event.target.name === "avatar") {
      inputValues = event.target.files[0];
      this.setState({ previewImg: this.createPreviewImg(inputValues) });
    } else {
      inputValues = event.target.value;
    }
    this.userForm.set(event.target.name, inputValues);
    this.setState({ [event.target.name]: inputValues });
  };

  createPreviewImg = (file) => URL.createObjectURL(file);

  handleSubmit = (e) => {
    e.preventDefault();
    updateUser(this.state._id, this.userForm)
      .then((updatedUser) => {
        this.setState({ updatedUser, openSuccess: true }, () => {
          setTimeout(() => {
            Router.push(`/profile/${this.state._id}`);
          }, 6000);
        });
      })
      .catch((err) => {
        this.showError(err);
      });
  };

  showError = (err) => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, openError: true, isSaving: false });
  };

  handleClose = () => this.setState({ openError: false });

  render() {
    const { classes } = this.props;
    const {
      name,
      email,
      about,
      avatar,
      previewImg,
      isLoading,
      isSaving,
      openError,
      openSuccess,
      updatedUser,
      error,
    } = this.state;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp />
          </Avatar>
          <Typography variant="h5" component="h1" color="primary">
            Edit Profile
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
            {isLoading ? (
              <Avatar className={classes.bigAvatar}>
                <FaceTwoTone />
              </Avatar>
            ) : (
              <Avatar
                src={previewImg || avatar}
                className={classes.bigAvatar}
              />
            )}
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={this.handleChange}
              className={classes.input}
            />
            <label htmlFor="avatar" className={classes.uploadButton}>
              <Button variant="contained" color="secondary" component="span">
                Upload Image <CloudUpload />
              </Button>
            </label>
            <span className={classes.filename}>{avatar && avatar.name}</span>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                name="name"
                type="text"
                onChange={this.handleChange}
                value={name}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                name="email"
                type="email"
                onChange={this.handleChange}
                value={email}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="about">About</InputLabel>
              <Input
                name="about"
                multiline
                rows={2}
                rowsMax={6}
                onChange={this.handleChange}
                value={about}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              disabled={isSaving || isLoading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isSaving ? "Updating..." : "Update"}
            </Button>
          </form>
        </Paper>
        {error && (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={openError}
            autoHideDuration={6000}
            onClose={this.handleClose}
            message={<span className={classes.snack}>{error}</span>}
          />
        )}

        <Dialog open={openSuccess} disableBackdropClick={false}>
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon} />
            Account updated
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {updatedUser && updatedUser.name} was successfully updated!
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(1) * 3,
    marginRight: theme.spacing(1) * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0.25em",
  },
  paper: {
    marginTop: theme.spacing(1) * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(1) * 2,
  },
  signinLink: {
    textDecoration: "none",
    color: "white",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(1) * 2,
  },
  snack: {
    color: theme.palette.secondary.light,
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green",
  },
  input: {
    display: "none",
  },
});

EditProfile.getInitialProps = authInitialProps(true);

export default withStyles(styles)(EditProfile);
