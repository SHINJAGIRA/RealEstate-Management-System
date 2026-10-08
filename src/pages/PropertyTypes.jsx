import React, { useState } from 'react';
import { 
  Box, Typography, Button, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, Card, CardContent, IconButton, Snackbar, Alert 
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

export default function PropertyTypes() {
  const { propertyTypes, addType, updateType, deleteType, properties } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchText, setSearchText] = useState('');

  const filteredTypes = propertyTypes.filter(t => 
    t.name.toLowerCase().includes(searchText.toLowerCase()) || 
    t.description.toLowerCase().includes(searchText.toLowerCase())
  ).map(type => {
    // calculate number of properties of this type
    const numProps = properties.filter(p => p.typeId === type.id).length;
    return { ...type, numProperties: numProps };
  });

  const handleOpen = (data = null) => {
    setEditData(data);
    if (data) {
      setFormData({ name: data.name, description: data.description, status: data.status });
    } else {
      setFormData({ name: '', description: '', status: 'Active' });
    }
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editData) {
      updateType(editData.id, { ...editData, ...formData });
      setSnackbar({ open: true, message: 'Updated successfully', severity: 'success' });
    } else {
      addType({ ...formData, id: `type-${uuidv4()}` });
      setSnackbar({ open: true, message: 'Added successfully', severity: 'success' });
    }
    setFormOpen(false);
  };

  const handleDelete = (id) => {
    const numProps = properties.filter(p => p.typeId === id).length;
    if (numProps > 0) {
      setSnackbar({ open: true, message: 'Cannot delete type that has properties', severity: 'error' });
      return;
    }
    if (window.confirm("Delete this property type?")) {
      deleteType(id);
      setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' });
    }
  };

  const columns = [
    { field: 'name', headerName: 'Type Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'numProperties', headerName: 'Properties', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
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
        <Typography variant="h4">Property Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Type
        </Button>
      </Box>

      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField 
            label="Search Property Types" 
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
            rows={filteredTypes}
            columns={columns}
            pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editData ? 'Edit Property Type' : 'Add Property Type'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }} id="type-form" onSubmit={handleSubmit}>
            <TextField 
              fullWidth margin="normal" label="Type Name" required
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextField 
              fullWidth margin="normal" label="Description" multiline rows={3}
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button type="submit" form="type-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
