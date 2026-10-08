import React, { useState, useEffect } from 'react';
import { 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  Grid, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

export default function TenantForm({ open, onClose, editData, onSuccess }) {
  const { properties, updateProperty, addTenant, updateTenant } = useAppContext();
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', idNumber: '', 
    propertyId: '', monthlyRent: 0, leaseStartDate: '', leaseEndDate: '', 
    rentStatus: 'Paid', status: 'Active'
  });

  const availableProperties = properties.filter(p => p.status === 'Available' || (editData && p.id === editData.propertyId));

  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData({ ...editData });
      } else {
        setFormData({
          fullName: '', phone: '', email: '', idNumber: '', 
          propertyId: '', monthlyRent: 0, leaseStartDate: '', leaseEndDate: '', 
          rentStatus: 'Paid', status: 'Active'
        });
      }
    }
  }, [open, editData]);

  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    const prop = properties.find(p => p.id === propId);
    setFormData(prev => ({ 
      ...prev, 
      propertyId: propId, 
      monthlyRent: prop ? prop.monthlyRent : 0 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.propertyId) return;

    if (editData) {
      // Check if property changed
      if (editData.propertyId !== formData.propertyId) {
        // Free old property
        const oldProp = properties.find(p => p.id === editData.propertyId);
        if (oldProp) updateProperty(oldProp.id, { ...oldProp, status: 'Available', availability: 'Available', tenantId: null });
        
        // Occupy new property
        const newProp = properties.find(p => p.id === formData.propertyId);
        if (newProp) updateProperty(newProp.id, { ...newProp, status: 'Occupied', availability: 'Occupied', tenantId: editData.id });
      }
      
      updateTenant(editData.id, formData);
      onSuccess("Tenant updated successfully!");
    } else {
      const newId = `ten-${uuidv4()}`;
      addTenant({ ...formData, id: newId });
      
      // Update property to Occupied
      const prop = properties.find(p => p.id === formData.propertyId);
      if (prop) {
        updateProperty(prop.id, { ...prop, status: 'Occupied', availability: 'Occupied', tenantId: newId });
      }
      
      onSuccess("Tenant added successfully!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editData ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }} id="tenant-form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Full Name" required
                value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="ID/Reference Number" 
                value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Phone" 
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Email" type="email"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth required>
                <InputLabel>Property</InputLabel>
                <Select value={formData.propertyId} label="Property" onChange={handlePropertyChange}>
                  {availableProperties.map(p => (
                    <MenuItem key={p.id} value={p.id}>{p.name} - {p.code}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth label="Monthly Rent" type="number" 
                value={formData.monthlyRent} InputProps={{ readOnly: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Lease Start Date" type="date" InputLabelProps={{ shrink: true }}
                value={formData.leaseStartDate} onChange={(e) => setFormData({...formData, leaseStartDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Lease End Date" type="date" InputLabelProps={{ shrink: true }}
                value={formData.leaseEndDate} onChange={(e) => setFormData({...formData, leaseEndDate: e.target.value})}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rent Status</InputLabel>
                <Select value={formData.rentStatus} label="Rent Status" onChange={(e) => setFormData({...formData, rentStatus: e.target.value})}>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                  <MenuItem value="Outstanding">Outstanding</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tenant Status</InputLabel>
                <Select value={formData.status} label="Tenant Status" onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Former">Former</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="tenant-form" variant="contained">
          {editData ? 'Save Changes' : 'Add Tenant'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
