import CircularProgress from "@material-ui/core/CircularProgress";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import Router from "next/router";
import { authInitialProps } from "../lib/auth";

import PostFeed from "../components/index/PostFeed";
import UserFeed from "../components/index/UserFeed";

const Index = ({ classes, auth }) => {
  return (
    <main className={classes.root}>
      {auth.user && auth.user._id ? (
        // "Auth user page"
        <Grid container>
          <Grid item xs={12} sm={12} md={7}>
            <PostFeed auth={auth} />
          </Grid>
          <Grid item className={classes.drawerContainer}>
            <Drawer
              className={classes.drawer}
              variant="permanent"
              anchor="right"
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <UserFeed auth />
            </Drawer>
          </Grid>
        </Grid>
      ) : (
        <Grid
          justify="center"
          alignItems="center"
          direction="row"
          container
          className={classes.heroContent}
        >
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            A Better Social Network
          </Typography>
          <Typography
            component="p"
            variant="h6"
            align="center"
            color="textSecondary"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
            perferendis molestiae sequi nesciunt id minima vero reprehenderit
            iusto sint quo?
          </Typography>
          <Button
            className={classes.fabButton}
            variant="contained"
            color="primary"
            onClick={() => Router.push("/signup")}
          >
            Get Started
          </Button>
        </Grid>
      )}
    </main>
  );
};

const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing(1) * 10,
    paddingLeft: theme.spacing(1) * 5,
    [theme.breakpoints.down("sm")]: {
      paddingRight: theme.spacing(1) * 5,
    },
  },
  progressContainer: {
    height: "80vh",
  },
  progress: {
    margin: theme.spacing(1) * 2,
    color: theme.palette.secondary.light,
  },
  drawerContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  drawer: {
    width: 350,
  },
  drawerPaper: {
    marginTop: 70,
    width: 350,
  },
  fabButton: {
    margin: theme.spacing(1) * 3,
    borderRadius: theme.spacing(1) * 5,
  },
  heroContent: {
    maxWidth: 600,
    paddingTop: theme.spacing(1) * 8,
    paddingBottom: theme.spacing(1) * 6,
    margin: "0 auto",
  },
});

Index.getInitialProps = authInitialProps();

export default withStyles(styles)(Index);
