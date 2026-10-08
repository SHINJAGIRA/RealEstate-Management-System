import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';

// Pages
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import PropertyTypes from './pages/PropertyTypes';
import Locations from './pages/Locations';
import Tenants from './pages/Tenants';
import RentPayments from './pages/RentPayments';
import Reports from './pages/Reports';

const theme = createTheme({
  palette: {
    primary: {
      main: '#111827', // Dark gray/black for primary
    },
    secondary: {
      main: '#4F46E5', // Indigo for accents
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#111827',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    subtitle2: {
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontSize: '0.75rem',
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111827',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<Properties />} />
              <Route path="properties/:propertyId" element={<PropertyDetails />} />
              <Route path="property-types" element={<PropertyTypes />} />
              <Route path="locations" element={<Locations />} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="rent-payments" element={<RentPayments />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
