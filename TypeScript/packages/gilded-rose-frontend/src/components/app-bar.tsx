import {
  AppBar as MuiAppBar,
  Breadcrumbs,
  Link,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { ClassNames } from '@emotion/react';

export interface Breadcrumb {
  title: string;
  href: string;
}

interface Props {
  breadcrumbs?: Array<Breadcrumb>;
}

const AppBar = ({ breadcrumbs = [] }: Props) => {
  const theme = useTheme();
  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <ClassNames>
          {({ css }) => (
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              classes={{
                separator: css({ color: theme.palette.common.white }),
              }}
            >
              <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                <Link underline="hover" color={theme.palette.common.white} href="/">
                  Gilded Rose Inventory Manager
                </Link>
              </Typography>
              {breadcrumbs.map(({ href, title }) => (
                <Link key={title} underline="hover" color={theme.palette.common.white} href={href}>
                  {title}
                </Link>
              ))}
            </Breadcrumbs>
          )}
        </ClassNames>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
