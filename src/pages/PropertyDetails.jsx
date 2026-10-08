import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  Tabs, Tab, Divider, Chip, Paper 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAppContext } from '../context/AppContext';
import PropertyForm from '../components/PropertyForm';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { properties, deleteProperty, tenants, payments } = useAppContext();
  
  const [tabValue, setTabValue] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  const property = properties.find(p => p.id === propertyId);
  const propertyTenants = tenants.filter(t => t.propertyId === propertyId);
  const activeTenant = propertyTenants.find(t => t.status === 'Active');
  const propertyPayments = payments.filter(p => p.propertyId === propertyId);

  if (!property) {
    return <Typography variant="h5">Property Not Found</Typography>;
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deleteProperty(property.id);
      navigate('/properties');
    }
  };

  const rentHistoryColumns = [
    { field: 'receiptNumber', headerName: 'Receipt', width: 150 },
    { field: 'paymentDate', headerName: 'Date', width: 120 },
    { field: 'amountPaid', headerName: 'Paid', width: 100, renderCell: (params) => `$${params.value}` },
    { field: 'balance', headerName: 'Balance', width: 100, renderCell: (params) => `$${params.value}` },
    { field: 'paymentMethod', headerName: 'Method', width: 120 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => (
      <Chip label={params.value} color={params.value === 'Completed' ? 'success' : 'warning'} size="small" />
    )},
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{property.name}</Typography>
        <Box>
          <Button startIcon={<EditIcon />} variant="outlined" sx={{ mr: 1 }} onClick={() => setFormOpen(true)}>Edit</Button>
          <Button startIcon={<DeleteIcon />} variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ mb: 3, border: '1px solid #E5E7EB' }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} indicatorColor="primary" textColor="primary">
          <Tab label="Property Overview" />
          <Tab label="Tenant Information" />
          <Tab label="Rent History" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}><Typography color="textSecondary">Code</Typography><Typography>{property.code}</Typography></Grid>
                  <Grid item xs={6} sm={4}><Typography color="textSecondary">Type</Typography><Typography>{property.type}</Typography></Grid>
                  <Grid item xs={6} sm={4}><Typography color="textSecondary">Status</Typography>
                    <Chip label={property.status} color={property.status === 'Occupied' ? 'primary' : 'default'} size="small" />
                  </Grid>
                  
                  <Grid item xs={6} sm={4}><Typography color="textSecondary">Location</Typography><Typography>{property.location}</Typography></Grid>
                  <Grid item xs={12} sm={8}><Typography color="textSecondary">Address</Typography><Typography>{property.address}</Typography></Grid>
                  
                  <Grid item xs={6} sm={3}><Typography color="textSecondary">Bedrooms</Typography><Typography>{property.bedrooms}</Typography></Grid>
                  <Grid item xs={6} sm={3}><Typography color="textSecondary">Bathrooms</Typography><Typography>{property.bathrooms}</Typography></Grid>
                  <Grid item xs={6} sm={3}><Typography color="textSecondary">Size (sqft)</Typography><Typography>{property.size}</Typography></Grid>
                  <Grid item xs={6} sm={3}><Typography color="textSecondary">Monthly Rent</Typography><Typography>${property.monthlyRent}</Typography></Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography color="textSecondary">Description</Typography>
                <Typography>{property.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
             <Card elevation={0}>
               <CardContent>
                 <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                 <Button fullWidth variant="contained" startIcon={<PersonAddIcon />} sx={{ mb: 1 }} onClick={() => navigate('/tenants')}>
                   Manage Tenants
                 </Button>
                 <Button fullWidth variant="outlined" onClick={() => setTabValue(2)}>
                   View Rent History
                 </Button>
               </CardContent>
             </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {activeTenant ? (
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Current Tenant</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Name</Typography>
                  <Typography>{activeTenant.fullName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Contact</Typography>
                  <Typography>{activeTenant.phone} | {activeTenant.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Lease Period</Typography>
                  <Typography>{activeTenant.leaseStartDate} to {activeTenant.leaseEndDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Rent Status</Typography>
                  <Chip label={activeTenant.rentStatus} color={activeTenant.rentStatus === 'Paid' ? 'success' : 'error'} size="small" />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/tenants')}>View in Tenants</Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box textAlign="center" py={5}>
            <Typography variant="h6" color="textSecondary" gutterBottom>No Active Tenant</Typography>
            <Button variant="contained" onClick={() => navigate('/tenants')}>Assign a Tenant</Button>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card elevation={0}>
          <CardContent style={{ height: 400 }}>
            <DataGrid
              rows={propertyPayments}
              columns={rentHistoryColumns}
              pageSizeOptions={[5, 10]}
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
              disableRowSelectionOnClick
              sx={{ border: 'none' }}
            />
          </CardContent>
        </Card>
      </TabPanel>

      <PropertyForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        editData={property}
        onSuccess={() => setFormOpen(false)}
      />
    </Box>
  );
}
