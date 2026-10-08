import React, { useState } from 'react';
import { 
  Box, Typography, Button, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, Card, CardContent, Snackbar, Alert 
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

export default function Locations() {
  const { locations, addLocation, updateLocation, deleteLocation, properties } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: '', area: '', status: 'Active' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchText, setSearchText] = useState('');

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchText.toLowerCase()) || 
    l.area.toLowerCase().includes(searchText.toLowerCase())
  ).map(loc => {
    const locProps = properties.filter(p => p.locationId === loc.id);
    return { 
      ...loc, 
      numProperties: locProps.length,
      occupiedProperties: locProps.filter(p => p.status === 'Occupied').length,
      vacantProperties: locProps.filter(p => p.status === 'Available').length
    };
  });

  const handleOpen = (data = null) => {
    setEditData(data);
    if (data) {
      setFormData({ name: data.name, area: data.area, status: data.status });
    } else {
      setFormData({ name: '', area: '', status: 'Active' });
    }
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editData) {
      updateLocation(editData.id, { ...editData, ...formData });
      setSnackbar({ open: true, message: 'Updated successfully', severity: 'success' });
    } else {
      addLocation({ ...formData, id: `loc-${uuidv4()}` });
      setSnackbar({ open: true, message: 'Added successfully', severity: 'success' });
    }
    setFormOpen(false);
  };

  const handleDelete = (id) => {
    const numProps = properties.filter(p => p.locationId === id).length;
    if (numProps > 0) {
      setSnackbar({ open: true, message: 'Cannot delete location that has properties', severity: 'error' });
      return;
    }
    if (window.confirm("Delete this location?")) {
      deleteLocation(id);
      setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' });
    }
  };

  const columns = [
    { field: 'name', headerName: 'Location Name', width: 200 },
    { field: 'area', headerName: 'District/Area', width: 150 },
    { field: 'numProperties', headerName: 'Properties', width: 100 },
    { field: 'occupiedProperties', headerName: 'Occupied', width: 100 },
    { field: 'vacantProperties', headerName: 'Vacant', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleOpen(params.row)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Locations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Location
        </Button>
      </Box>

      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField 
            label="Search Locations" 
            variant="outlined" 
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card elevation={0}>
        <CardContent style={{ height: 500, padding: 0 }}>
          <DataGrid
            rows={filteredLocations}
            columns={columns}
            pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editData ? 'Edit Location' : 'Add Location'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }} id="loc-form" onSubmit={handleSubmit}>
            <TextField 
              fullWidth margin="normal" label="Location Name" required
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextField 
              fullWidth margin="normal" label="District / Area" required
              value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button type="submit" form="loc-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
