import React, { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Grid,
  Container,
  Typography,
  makeStyles,
  colors,
  Icon,
} from "@material-ui/core";

import { useExhibitions } from "services/management/exhibitions";
import FormatDateTime from "components/FormatDateTime";
import { useStyles } from "styles";

const useLocalStyles = makeStyles((theme) => ({
  font: {
    fontFamily: '"Oswald", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  active: {
    color: colors.deepOrange[600],
  },
  inactive: {
    color: colors.grey[600],
  },
}));

const Exhibitions = () => {
  const classes = useStyles();
  const classesLocal = useLocalStyles();
  const { exhibitions } = useExhibitions(1, 10, true);

  const isActive = useCallback((start, expire) => {
    const startDate = new Date(start);
    const endDate = new Date(expire);
    const now = new Date();
    return endDate > now && now > startDate;
  });

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <Grid container spacing={1}>
        {exhibitions.map((exhibition) => (
          <React.Fragment key={exhibition.id}>
            <Grid item xs={12}>
              {isActive(exhibition.start, exhibition.expire) ? (
                <Typography
                  component={RouterLink}
                  to={`/exhibition/${exhibition.id}`}
                  target={exhibition.id}
                  variant="h4"
                  style={{ textDecoration: "none" }}
                  className={classesLocal.active + " " + classesLocal.font}
                >
                  {exhibition.title} <Icon>open_in_new</Icon>
                </Typography>
              ) : (
                <Typography
                  variant="h4"
                  className={classesLocal.inactive + " " + classesLocal.font}
                >
                  {exhibition.title}
                </Typography>
              )}
            </Grid>
            <Grid item xs={2} className={classes.mb1}>
              <Typography
                component="span"
                variant="subtitle2"
                className={classes.mr2 + " " + classesLocal.font}
              >
                <FormatDateTime value={exhibition.start} time={false} /> -{" "}
                <FormatDateTime value={exhibition.expire} time={false} />
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography
                component="span"
                variant="body2"
                className={classesLocal.font}
              >
                {exhibition.summary}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Container>
  );
};

export default Exhibitions;
