import React, { useMemo } from 'react';
import { Typography, Grid, Card, CardContent, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#3B82F6'];

export default function Dashboard() {
  const { properties, tenants, payments } = useAppContext();

  // Derived calculations using useMemo to optimize
  const stats = useMemo(() => {
    const totalProperties = properties.length;
    const occupiedProperties = properties.filter(p => p.status === 'Occupied').length;
    const vacantProperties = properties.filter(p => p.status === 'Available').length;
    const maintenanceProperties = properties.filter(p => p.status === 'Under Maintenance').length;
    const totalTenants = tenants.length;

    // Expected monthly rent is sum of all rent of occupied properties
    const expectedRent = properties
      .filter(p => p.status === 'Occupied')
      .reduce((sum, p) => sum + p.monthlyRent, 0);

    // Collected rent based on payments (simplified: sum of all amountPaid in records)
    const collectedRent = payments.reduce((sum, pay) => sum + pay.amountPaid, 0);
    const outstandingRent = payments.reduce((sum, pay) => sum + pay.balance, 0);

    return {
      totalProperties,
      occupiedProperties,
      vacantProperties,
      maintenanceProperties,
      totalTenants,
      expectedRent,
      collectedRent,
      outstandingRent
    };
  }, [properties, tenants, payments]);

  const propertiesByType = useMemo(() => {
    const typesCount = properties.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(typesCount).map(key => ({ name: key, value: typesCount[key] }));
  }, [properties]);

  const occupancyData = useMemo(() => {
    return [
      { name: 'Occupied', value: stats.occupiedProperties },
      { name: 'Vacant', value: stats.vacantProperties },
      { name: 'Maintenance', value: stats.maintenanceProperties },
    ];
  }, [stats]);

  // Very simplified monthly income - just grouping by payment date month
  const monthlyIncome = useMemo(() => {
    const incomeByMonth = payments.reduce((acc, pay) => {
      const month = pay.paymentDate.substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + pay.amountPaid;
      return acc;
    }, {});
    
    return Object.keys(incomeByMonth)
      .sort()
      .map(month => ({
        name: month,
        income: incomeByMonth[month]
      }));
  }, [payments]);

  const StatCard = ({ title, value, prefix = '' }) => (
    <Card elevation={0}>
      <CardContent sx={{ p: 3 }}>
        <Typography color="text.secondary" gutterBottom variant="subtitle2">
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ mt: 1 }}>
          {prefix}{typeof value === 'number' && prefix === '$' ? value.toLocaleString() : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Properties" value={stats.totalProperties} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Occupied Properties" value={stats.occupiedProperties} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Vacant Properties" value={stats.vacantProperties} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Under Maintenance" value={stats.maintenanceProperties} /></Grid>
        
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Tenants" value={stats.totalTenants} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Expected Monthly Rent" value={stats.expectedRent} prefix="$" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Collected Rent" value={stats.collectedRent} prefix="$" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Outstanding Rent" value={stats.outstandingRent} prefix="$" /></Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Properties by Type Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, height: 350, border: '1px solid #E5E7EB' }}>
            <Typography variant="h6" gutterBottom>Properties by Type</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={propertiesByType} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {propertiesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Occupancy Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, height: 350, border: '1px solid #E5E7EB' }}>
            <Typography variant="h6" gutterBottom>Occupancy Status</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" dataKey="value" label>
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Monthly Income Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, height: 350, border: '1px solid #E5E7EB' }}>
            <Typography variant="h6" gutterBottom>Monthly Rental Income</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(value) => `$${value}`} cursor={{fill: '#F3F4F6'}} />
                <Bar dataKey="income" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Items Lists */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
            <Typography variant="h6" gutterBottom>Recently Added Properties</Typography>
            <List dense>
              {properties.slice(-5).reverse().map(p => (
                <ListItem key={p.id} sx={{ px: 0 }}>
                  <ListItemText primary={p.name} secondary={`${p.type} - ${p.location}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
            <Typography variant="h6" gutterBottom>Tenants with Outstanding Rent</Typography>
            <List dense>
              {tenants.filter(t => t.rentStatus === 'Outstanding' || t.rentStatus === 'Partially Paid').slice(0,5).map(t => (
                <ListItem key={t.id} sx={{ px: 0 }}>
                  <ListItemText primary={t.fullName} secondary={`Status: ${t.rentStatus}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
