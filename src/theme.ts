import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0f172a', // Slate 900 - Deep professional blue-black
            light: '#334155',
            dark: '#020617',
        },
        secondary: {
            main: '#3b82f6', // Bright Blue for accents
        },
        background: {
            default: '#f8fafc', // Slate 50
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b', // Slate 800
            secondary: '#64748b', // Slate 500
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none', // Modern feel
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12, // Softer corners
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0',
                },
            },
        },
    },
});

export default theme;
