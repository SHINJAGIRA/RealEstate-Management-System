import React, { useState } from 'react';
import { 
  Box, Typography, Button, TextField, Card, CardContent, Snackbar, Alert, Chip 
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAppContext } from '../context/AppContext';
import TenantForm from '../components/TenantForm';

export default function Tenants() {
  const { tenants, deleteTenant, properties, updateProperty } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchText, setSearchText] = useState('');

  const filteredTenants = tenants.filter(t => 
    t.fullName.toLowerCase().includes(searchText.toLowerCase()) || 
    t.email.toLowerCase().includes(searchText.toLowerCase()) ||
    t.phone.includes(searchText)
  ).map(t => {
    const prop = properties.find(p => p.id === t.propertyId);
    return { ...t, propertyName: prop ? prop.name : 'Unknown' };
  });

  const handleEdit = (id) => {
    const tenant = tenants.find(t => t.id === id);
    if (tenant) {
      setEditData(tenant);
      setFormOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this tenant? This will also free up their property.")) {
      const tenant = tenants.find(t => t.id === id);
      if (tenant) {
        const prop = properties.find(p => p.id === tenant.propertyId);
        if (prop) {
          updateProperty(prop.id, { ...prop, status: 'Available', availability: 'Available', tenantId: null });
        }
      }
      deleteTenant(id);
      setSnackbar({ open: true, message: 'Tenant deleted successfully', severity: 'success' });
    }
  };

  const columns = [
    { field: 'fullName', headerName: 'Name', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'propertyName', headerName: 'Property', width: 200 },
    { field: 'monthlyRent', headerName: 'Rent', width: 100, renderCell: (params) => `$${params.value}` },
    { 
      field: 'rentStatus', 
      headerName: 'Rent Status', 
      width: 130,
      renderCell: (params) => {
        let color = 'default';
        if (params.value === 'Paid') color = 'success';
        if (params.value === 'Outstanding') color = 'error';
        if (params.value === 'Partially Paid') color = 'warning';
        return <Chip label={params.value} color={color} size="small" />;
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'Active' ? 'primary' : 'default'} size="small" />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.id)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tenants</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditData(null); setFormOpen(true); }}>
          Add Tenant
        </Button>
      </Box>

      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField 
            label="Search Tenants (Name, Email, Phone)" 
            variant="outlined" 
            size="small"
            sx={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card elevation={0}>
        <CardContent style={{ height: 600, padding: 0 }}>
          <DataGrid
            rows={filteredTenants}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      <TenantForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        editData={editData}
        onSuccess={(msg) => {
          setFormOpen(false);
          setSnackbar({ open: true, message: msg, severity: 'success' });
        }}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
