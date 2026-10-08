import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Button, TextField, Select, MenuItem, 
  InputLabel, FormControl, Chip, Grid, Card, CardContent, 
  Snackbar, Alert, Slider
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import PropertyForm from '../components/PropertyForm';

export default function Properties() {
  const { properties, addProperty, deleteProperty, propertyTypes, locations } = useAppContext();
  const navigate = useNavigate();
  
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filtering Logic
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchSearch = 
        p.name.toLowerCase().includes(searchText.toLowerCase()) || 
        p.code.toLowerCase().includes(searchText.toLowerCase()) ||
        p.address.toLowerCase().includes(searchText.toLowerCase());
        
      const matchType = filterType === 'All' || p.typeId === filterType;
      const matchLocation = filterLocation === 'All' || p.locationId === filterLocation;
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      const matchPrice = p.monthlyRent >= priceRange[0] && p.monthlyRent <= priceRange[1];
      
      return matchSearch && matchType && matchLocation && matchStatus && matchPrice;
    });
  }, [properties, searchText, filterType, filterLocation, filterStatus, priceRange]);

  const clearFilters = () => {
    setSearchText('');
    setFilterType('All');
    setFilterLocation('All');
    setFilterStatus('All');
    setPriceRange([0, 10000]);
  };

  const handleEdit = (id) => {
    const prop = properties.find(p => p.id === id);
    if (prop) {
      setEditProperty(prop);
      setFormOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deleteProperty(id);
      setSnackbar({ open: true, message: 'Property deleted successfully', severity: 'success' });
    }
  };

  const handleView = (id) => {
    navigate(`/properties/${id}`);
  };

  const generateFakeData = () => {
    // We add 5 random properties from the initial properties data that aren't already there
    // Or just generate 5 new ones dynamically
    for (let i = 0; i < 5; i++) {
      const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const randomLoc = locations[Math.floor(Math.random() * locations.length)];
      
      const newProp = {
        id: `prop-fake-${Math.floor(Math.random() * 100000)}`,
        code: `PRP-${Math.floor(Math.random() * 9000) + 1000}`,
        name: `Fake ${randomType?.name || 'Property'}`,
        typeId: randomType?.id || '',
        type: randomType?.name || '',
        locationId: randomLoc?.id || '',
        location: randomLoc?.name || '',
        address: `${Math.floor(Math.random() * 900) + 100} Fake St`,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        size: Math.floor(Math.random() * 2000) + 500,
        monthlyRent: Math.floor(Math.random() * 3000) + 500,
        tenantId: null,
        availability: 'Available',
        status: 'Available',
        description: 'Auto-generated fake property.'
      };
      addProperty(newProp);
    }
    setSnackbar({ open: true, message: 'Generated 5 fake properties!', severity: 'success' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Occupied': return 'primary';
      case 'Reserved': return 'warning';
      case 'Under Maintenance': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'location', headerName: 'Location', width: 150 },
    { 
      field: 'monthlyRent', 
      headerName: 'Rent', 
      width: 100,
      renderCell: (params) => `$${params.value}`
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value)} 
          size="small" 
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem icon={<VisibilityIcon />} label="View" onClick={() => handleView(params.id)} />,
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.id)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Properties</Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="secondary"
            startIcon={<AutoFixHighIcon />}
            onClick={generateFakeData}
            sx={{ mr: 2 }}
          >
            Add Fake Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => {
              setEditProperty(null);
              setFormOpen(true);
            }}
          >
            Add Property
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField 
                fullWidth 
                label="Search (Name, Code, Address)" 
                variant="outlined" 
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Property Type</InputLabel>
                <Select value={filterType} label="Property Type" onChange={(e) => setFilterType(e.target.value)}>
                  <MenuItem value="All">All Types</MenuItem>
                  {propertyTypes.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Location</InputLabel>
                <Select value={filterLocation} label="Location" onChange={(e) => setFilterLocation(e.target.value)}>
                  <MenuItem value="All">All Locations</MenuItem>
                  {locations.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="All">All Statuses</MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Occupied">Occupied</MenuItem>
                  <MenuItem value="Reserved">Reserved</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" gutterBottom>Price Range (${priceRange[0]} - ${priceRange[1]})</Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" size="small" onClick={clearFilters}>Clear Filters</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* DataGrid */}
      <Card elevation={0}>
        <CardContent style={{ height: 600, width: '100%', padding: 0 }}>
          <DataGrid
            rows={filteredProperties}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Form Dialog */}
      <PropertyForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        editData={editProperty}
        onSuccess={(msg) => {
          setFormOpen(false);
          setSnackbar({ open: true, message: msg, severity: 'success' });
        }}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
