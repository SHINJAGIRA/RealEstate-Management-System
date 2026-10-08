import React, { useState } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, Grid, 
  Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { useAppContext } from '../context/AppContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Reports() {
  const { properties, tenants, payments, propertyTypes, locations } = useAppContext();
  const [tabValue, setTabValue] = useState(0);

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = (data, filename) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
  };

  // --- Report Data Calculations ---
  
  // Property Inventory
  const inventoryData = properties.map(p => ({
    Code: p.code, Name: p.name, Type: p.type, Location: p.location, Status: p.status, Rent: p.monthlyRent
  }));

  // Occupancy / Vacancy
  const occupancyData = properties.map(p => ({
    Code: p.code, Name: p.name, Status: p.status, Tenant: tenants.find(t => t.id === p.tenantId)?.fullName || 'None'
  }));
  
  // Financial (Rent Collection & Outstanding)
  const financialData = tenants.map(t => {
    const tenantPayments = payments.filter(p => p.tenantId === t.id);
    const totalPaid = tenantPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    // Rough calculation for demo: rent * months (assumed 1 for simplicity of mock)
    const expected = t.monthlyRent; 
    const outstanding = expected - totalPaid > 0 ? expected - totalPaid : 0;
    
    return {
      Tenant: t.fullName,
      Property: properties.find(p => p.id === t.propertyId)?.name || 'N/A',
      ExpectedRent: expected,
      TotalPaid: totalPaid,
      Outstanding: outstanding
    };
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }} className="no-print">
        <Typography variant="h4">Reports</Typography>
        <Box>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ mr: 1 }}>
            Print
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} className="no-print" sx={{ mb: 3, border: '1px solid #E5E7EB' }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} variant="scrollable" scrollButtons="auto">
          <Tab label="Property Inventory" />
          <Tab label="Occupancy & Vacancy" />
          <Tab label="Rent Collection & Outstanding" />
        </Tabs>
      </Paper>

      <Card elevation={0}>
        <CardContent>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Property Inventory Report</Typography>
              <Button size="small" startIcon={<DownloadIcon />} onClick={() => exportCSV(inventoryData, 'inventory.csv')}>Export CSV</Button>
            </Box>
            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ border: '1px solid #E5E7EB' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Code}</TableCell>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.Type}</TableCell>
                      <TableCell>{row.Location}</TableCell>
                      <TableCell>{row.Status}</TableCell>
                      <TableCell>${row.Rent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Occupancy & Vacancy Report</Typography>
              <Button size="small" startIcon={<DownloadIcon />} onClick={() => exportCSV(occupancyData, 'occupancy.csv')}>Export CSV</Button>
            </Box>
            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ border: '1px solid #E5E7EB' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tenant</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {occupancyData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Code}</TableCell>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.Status}</TableCell>
                      <TableCell>{row.Tenant}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Financial Report (Rent Collection & Outstanding)</Typography>
              <Button size="small" startIcon={<DownloadIcon />} onClick={() => exportCSV(financialData, 'financials.csv')}>Export CSV</Button>
            </Box>
            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ border: '1px solid #E5E7EB' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tenant</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Expected Rent</TableCell>
                    <TableCell>Total Paid</TableCell>
                    <TableCell>Outstanding</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {financialData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Tenant}</TableCell>
                      <TableCell>{row.Property}</TableCell>
                      <TableCell>${row.ExpectedRent}</TableCell>
                      <TableCell>${row.TotalPaid}</TableCell>
                      <TableCell sx={{ color: row.Outstanding > 0 ? 'error.main' : 'inherit' }}>
                        ${row.Outstanding}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </CardContent>
      </Card>
      
      {/* Basic styles to hide UI when printing */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .MuiDrawer-root { display: none !important; }
            header { display: none !important; }
            main { width: 100% !important; margin: 0 !important; padding: 0 !important; }
          }
        `}
      </style>
    </Box>
  );
}
