import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Lock from "@material-ui/icons/Lock";
import withStyles from "@material-ui/core/styles/withStyles";
import Router from "next/router";

import { signinUser } from "../lib/auth";
class Signin extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
    openError: false,
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
    const { email, password } = this.state;
    this.setState({ isLoading: true });
    signinUser({ email, password })
      .then(() => Router.push("/"))
      .catch(this.showError);
  };

  handleClose = () => this.setState({ openError: false });

  render() {
    const { classes } = this.props;
    const { email, password, error, openError, isLoading } = this.state;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="h1">
            Sign In
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
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

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isLoading ? "Signing in..." : "Sign In"}
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
});

export default withStyles(styles)(Signin);
