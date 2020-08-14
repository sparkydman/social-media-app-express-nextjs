import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import withStyles from "@material-ui/core/styles/withStyles";
import { signUpUser } from "../lib/auth";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
class Signup extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    about: "",
    createdUser: null,
    error: "",
    openError: false,
    openSuccess: false,
    isLoading: false,
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showError = (err) => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, openError: true, isLoading: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, password } = this.state;
    this.setState({ isLoading: true });
    signUpUser({ name, email, password })
      .then((createdUser) =>
        this.setState({
          createdUser,
          error: "",
          name: "",
          email: "",
          password: "",
          about: "",
          openSuccess: true,
          isLoading: false,
        })
      )
      .catch(this.showError);
  };

  handleClose = () => this.setState({ openError: false });

  render() {
    const { classes } = this.props;
    const {
      name,
      email,
      password,
      about,
      error,
      openError,
      createdUser,
      openSuccess,
      isLoading,
    } = this.state;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Gavel />
          </Avatar>
          <Typography variant="h5" component="h1">
            Sign Up
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
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
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                onChange={this.handleChange}
                value={password}
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
              disabled={isLoading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
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
        </Paper>

        <Dialog
          open={openSuccess}
          disableBackdropClick={true}
          TransitionComponent={Transition}
        >
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon} />
            New Account
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {createdUser} successfully created!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" variant="contained">
              <Link href="/signin">
                <a className={classes.signinLink}>Sign in</a>
              </Link>
            </Button>
          </DialogActions>
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
  title: {
    marginTop: theme.spacing(1) * 2,
    color: theme.palette.openTitle,
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
});

export default withStyles(styles)(Signup);
