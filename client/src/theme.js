import { createTheme } from '@material-ui/core/styles';

export const colors = {
  white: '#fff',
  black: '#000',
  border: '#ca1c3c',
  borderFocus: '#b2b2e7',
  borderError: '#e0bbbb',
  tableColor: '#536270',
  label: '#73738b'
};

export const fontSizes = {
  main: 16,
  title: 20,
  subTitle: 16,
  largeTitle: 42
};

const theme = createTheme({
  typography: {
    fontSize: fontSizes.main,
    body1: {
      fontSize: fontSizes.main,
      lineHeight: 'normal'
    }
  },
  palette: {
    common: {
      black: colors.black,
      white: colors.white
    },
    primary: {
      main: '#e21c40',
      contrastText: colors.white
    },
    secondary: {
      main: '#006cf0',
      contrastText: colors.white
    },
    error: {
      main: '#ff7272',
      contrastText: colors.white
    },
    background: {
      default: '#f7f8fa',
      paper: colors.white
    },
    text: {
      primary: colors.black,
      secondary: colors.label,
      disabled: colors.label,
      hint: '#a4a6aa'
    },
    divider: '#e3e4e8',
    action: {
      active: colors.borderFocus,
      hover: colors.borderFocus,
      hoverOpacity: 0.08,
      selected: colors.borderFocus,
      disabled: '#e4e4f3',
      disabledBackground: '#f3f4f7'
    }
  },
  overrides: {
    MuiButton: {
      root: {
        fontSize: fontSizes.main,
        textTransform: 'none'
      },
      contained: {
        boxShadow: 'none !important'
      }
    },

    MuiInputBase: {
      root: {
        width: '225px'
      },
      input: {
        padding: '10px !important'
      }
    },
  }
});

export default theme;
