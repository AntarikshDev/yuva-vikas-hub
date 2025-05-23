
export const themeConfig = {
  colors: {
    // Government aligned color palette
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3', // Primary brand color
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    secondary: {
      50: '#e8eaf6',
      100: '#c5cae9',
      200: '#9fa8da',
      300: '#7986cb',
      400: '#5c6bc0',
      500: '#3f51b5', // Secondary color
      600: '#3949ab',
      700: '#303f9f',
      800: '#283593',
      900: '#1a237e',
    },
    success: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      500: '#4caf50',
      700: '#388e3c',
      900: '#1b5e20',
    },
    error: {
      50: '#ffebee',
      100: '#ffcdd2',
      500: '#f44336',
      700: '#d32f2f',
      900: '#b71c1c',
    },
    warning: {
      50: '#fff8e1',
      100: '#ffecb3',
      500: '#ffc107',
      700: '#ffa000',
      900: '#ff6f00',
    },
    info: {
      50: '#e1f5fe',
      100: '#b3e5fc',
      500: '#03a9f4',
      700: '#0288d1',
      900: '#01579b',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    xxl: '1rem',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      heading: 'Inter, system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Export tailwind CSS custom configuration
export const tailwindTheme = {
  extend: {
    colors: {
      primary: themeConfig.colors.primary,
      secondary: themeConfig.colors.secondary,
      success: themeConfig.colors.success,
      error: themeConfig.colors.error,
      warning: themeConfig.colors.warning,
      info: themeConfig.colors.info,
      neutral: themeConfig.colors.neutral,
    },
    fontFamily: {
      sans: themeConfig.typography.fontFamily.sans.split(','),
      heading: themeConfig.typography.fontFamily.heading.split(','),
    },
    boxShadow: {
      xs: themeConfig.shadows.xs,
      sm: themeConfig.shadows.sm,
      md: themeConfig.shadows.md,
      lg: themeConfig.shadows.lg,
      xl: themeConfig.shadows.xl,
      '2xl': themeConfig.shadows['2xl'],
    },
  },
};
