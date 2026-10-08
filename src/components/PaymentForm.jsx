import React, { useState, useEffect } from 'react';
import { 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  Grid, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

export default function PaymentForm({ open, onClose, editData, onSuccess }) {
  const { tenants, updateTenant, addPayment, updatePayment } = useAppContext();
  
  const [formData, setFormData] = useState({
    tenantId: '', paymentDate: '', amountPaid: 0, paymentMethod: 'Bank Transfer', referenceNumber: ''
  });

  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData({ ...editData });
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          tenantId: tenants[0]?.id || '', paymentDate: today, 
          amountPaid: 0, paymentMethod: 'Bank Transfer', referenceNumber: `REF-${Math.floor(Math.random() * 1000000)}`
        });
      }
    }
  }, [open, editData, tenants]);

  const handleTenantChange = (e) => {
    const tenantId = e.target.value;
    const tenant = tenants.find(t => t.id === tenantId);
    setFormData(prev => ({ 
      ...prev, 
      tenantId: tenantId, 
      amountPaid: tenant ? tenant.monthlyRent : 0 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tenantId) return;

    const tenant = tenants.find(t => t.id === formData.tenantId);
    if (!tenant) return;

    const rentAmount = tenant.monthlyRent;
    const amountPaidNum = Number(formData.amountPaid);
    const balance = rentAmount - amountPaidNum;
    
    const finalData = {
      ...formData,
      amountPaid: amountPaidNum,
      rentAmount: rentAmount,
      balance: balance,
      propertyId: tenant.propertyId,
      status: balance <= 0 ? 'Completed' : 'Pending'
    };

    if (editData) {
      updatePayment(editData.id, finalData);
      onSuccess("Payment updated successfully!");
    } else {
      const newId = `pay-${uuidv4()}`;
      addPayment({ 
        ...finalData, 
        id: newId, 
        receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}` 
      });
      onSuccess("Payment recorded successfully!");
    }

    // Update tenant's rent status
    let newRentStatus = 'Paid';
    if (balance > 0 && amountPaidNum > 0) newRentStatus = 'Partially Paid';
    if (amountPaidNum === 0) newRentStatus = 'Outstanding';
    
    updateTenant(tenant.id, { ...tenant, rentStatus: newRentStatus });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editData ? 'Edit Payment' : 'Record Payment'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }} id="payment-form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Tenant</InputLabel>
                <Select value={formData.tenantId} label="Tenant" onChange={handleTenantChange} disabled={!!editData}>
                  {tenants.map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.fullName} (Rent: ${t.monthlyRent})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Payment Date" type="date" InputLabelProps={{ shrink: true }} required
                value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Amount Paid ($)" type="number" required
                value={formData.amountPaid} onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select value={formData.paymentMethod} label="Payment Method" onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth label="Reference Number" 
                value={formData.referenceNumber} onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="payment-form" variant="contained">
          {editData ? 'Save Changes' : 'Record Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
