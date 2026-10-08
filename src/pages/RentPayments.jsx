import React, { useState } from 'react';
import { 
  Box, Typography, Button, TextField, Card, CardContent, Snackbar, Alert, Chip 
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import { useAppContext } from '../context/AppContext';
import PaymentForm from '../components/PaymentForm';

export default function RentPayments() {
  const { payments, deletePayment, tenants, properties } = useAppContext();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchText, setSearchText] = useState('');

  const enrichedPayments = payments.map(pay => {
    const tenant = tenants.find(t => t.id === pay.tenantId);
    const prop = properties.find(p => p.id === pay.propertyId);
    return { 
      ...pay, 
      tenantName: tenant ? tenant.fullName : 'Unknown',
      propertyName: prop ? prop.name : 'Unknown'
    };
  });

  const filteredPayments = enrichedPayments.filter(pay => 
    pay.receiptNumber.toLowerCase().includes(searchText.toLowerCase()) || 
    pay.tenantName.toLowerCase().includes(searchText.toLowerCase()) ||
    pay.propertyName.toLowerCase().includes(searchText.toLowerCase()) ||
    pay.referenceNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEdit = (id) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setEditData(payment);
      setFormOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this payment record? Note: This won't automatically revert tenant balance in this simple mock version.")) {
      deletePayment(id);
      setSnackbar({ open: true, message: 'Payment deleted successfully', severity: 'success' });
    }
  };

  const handlePrint = (row) => {
    // Simple print logic for mock
    window.alert(`Printing Receipt ${row.receiptNumber}\nTenant: ${row.tenantName}\nAmount: $${row.amountPaid}\nDate: ${row.paymentDate}`);
  };

  const columns = [
    { field: 'receiptNumber', headerName: 'Receipt No.', width: 150 },
    { field: 'paymentDate', headerName: 'Date', width: 120 },
    { field: 'tenantName', headerName: 'Tenant', width: 150 },
    { field: 'propertyName', headerName: 'Property', width: 150 },
    { field: 'amountPaid', headerName: 'Amount', width: 100, renderCell: (params) => `$${params.value}` },
    { field: 'balance', headerName: 'Balance', width: 100, renderCell: (params) => `$${params.value}` },
    { field: 'paymentMethod', headerName: 'Method', width: 130 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'Completed' ? 'success' : 'warning'} size="small" />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 130,
      getActions: (params) => [
        <GridActionsCellItem icon={<PrintIcon />} label="Print" onClick={() => handlePrint(params.row)} />,
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.id)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Rent Payments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditData(null); setFormOpen(true); }}>
          Record Payment
        </Button>
      </Box>

      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField 
            label="Search Payments (Receipt, Tenant, Property, Ref)" 
            variant="outlined" 
            size="small"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card elevation={0}>
        <CardContent style={{ height: 600, padding: 0 }}>
          <DataGrid
            rows={filteredPayments}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'paymentDate', sort: 'desc' }] },
            }}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      <PaymentForm 
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
