import React, { useState, useEffect } from 'react';
import { 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  Grid, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

export default function PropertyForm({ open, onClose, editData, onSuccess }) {
  const { properties, addProperty, updateProperty, propertyTypes, locations } = useAppContext();
  
  const [formData, setFormData] = useState({
    code: '', name: '', typeId: '', locationId: '', address: '', 
    bedrooms: 0, bathrooms: 0, size: 0, monthlyRent: 0, 
    status: 'Available', description: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData({ ...editData });
      } else {
        setFormData({
          code: `PRP-${Math.floor(Math.random() * 9000) + 1000}`,
          name: '', typeId: propertyTypes[0]?.id || '', locationId: locations[0]?.id || '', address: '', 
          bedrooms: 1, bathrooms: 1, size: 500, monthlyRent: 1000, 
          status: 'Available', description: ''
        });
      }
      setErrors({});
    }
  }, [open, editData, propertyTypes, locations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.code) tempErrors.code = "Code is required";
    else if (!editData && properties.some(p => p.code === formData.code)) {
      tempErrors.code = "Code must be unique";
    }
    
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.address) tempErrors.address = "Address is required";
    if (!formData.typeId) tempErrors.typeId = "Type is required";
    if (!formData.locationId) tempErrors.locationId = "Location is required";
    
    if (formData.bedrooms < 0) tempErrors.bedrooms = "Must be valid number";
    if (formData.bathrooms < 0) tempErrors.bathrooms = "Must be valid number";
    if (formData.size <= 0) tempErrors.size = "Must be greater than 0";
    if (formData.monthlyRent <= 0) tempErrors.monthlyRent = "Must be greater than 0";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Get names for display mapping
    const typeName = propertyTypes.find(t => t.id === formData.typeId)?.name || '';
    const locName = locations.find(l => l.id === formData.locationId)?.name || '';
    
    // Determine availability from status
    const availabilityMap = {
      'Available': 'Available',
      'Occupied': 'Occupied',
      'Reserved': 'Unavailable',
      'Under Maintenance': 'Unavailable',
      'Unavailable': 'Unavailable',
    };
    const availability = availabilityMap[formData.status] || 'Unavailable';

    const finalData = {
      ...formData,
      type: typeName,
      location: locName,
      availability: availability,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      size: Number(formData.size),
      monthlyRent: Number(formData.monthlyRent),
    };

    if (editData) {
      updateProperty(editData.id, finalData);
      onSuccess("Property updated successfully!");
    } else {
      addProperty({ ...finalData, id: `prop-${uuidv4()}`, tenantId: null });
      onSuccess("Property added successfully!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editData ? 'Edit Property' : 'Add New Property'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }} id="property-form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Property Code" name="code" 
                value={formData.code} onChange={handleChange}
                error={!!errors.code} helperText={errors.code}
                disabled={!!editData} // usually don't change code after creation
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Property Name" name="name" 
                value={formData.name} onChange={handleChange}
                error={!!errors.name} helperText={errors.name}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.typeId}>
                <InputLabel>Property Type</InputLabel>
                <Select name="typeId" value={formData.typeId} label="Property Type" onChange={handleChange}>
                  {propertyTypes.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.locationId}>
                <InputLabel>Location</InputLabel>
                <Select name="locationId" value={formData.locationId} label="Location" onChange={handleChange}>
                  {locations.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Address" name="address" 
                value={formData.address} onChange={handleChange}
                error={!!errors.address} helperText={errors.address}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField 
                fullWidth label="Bedrooms" name="bedrooms" type="number" 
                value={formData.bedrooms} onChange={handleChange}
                error={!!errors.bedrooms} helperText={errors.bedrooms}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField 
                fullWidth label="Bathrooms" name="bathrooms" type="number" 
                value={formData.bathrooms} onChange={handleChange}
                error={!!errors.bathrooms} helperText={errors.bathrooms}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField 
                fullWidth label="Size (sqft)" name="size" type="number" 
                value={formData.size} onChange={handleChange}
                error={!!errors.size} helperText={errors.size}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField 
                fullWidth label="Monthly Rent ($)" name="monthlyRent" type="number" 
                value={formData.monthlyRent} onChange={handleChange}
                error={!!errors.monthlyRent} helperText={errors.monthlyRent}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Occupied">Occupied</MenuItem>
                  <MenuItem value="Reserved">Reserved</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Unavailable">Unavailable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Description" name="description" multiline rows={3}
                value={formData.description} onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="property-form" variant="contained">
          {editData ? 'Save Changes' : 'Add Property'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
