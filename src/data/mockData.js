export const initialLocations = [
  { id: 'loc-1', name: 'Downtown District', area: 'Central', status: 'Active' },
  { id: 'loc-2', name: 'Westside Suburbs', area: 'West', status: 'Active' },
  { id: 'loc-3', name: 'North Hills', area: 'North', status: 'Active' },
  { id: 'loc-4', name: 'East End Tech Park', area: 'East', status: 'Active' },
  { id: 'loc-5', name: 'South Bay', area: 'South', status: 'Active' },
  { id: 'loc-6', name: 'Riverfront', area: 'Central', status: 'Active' },
  { id: 'loc-7', name: 'University Campus Area', area: 'North', status: 'Active' },
  { id: 'loc-8', name: 'Industrial Zone', area: 'East', status: 'Active' }
];

export const initialPropertyTypes = [
  { id: 'type-1', name: 'Apartment', description: 'Residential apartment in a multi-unit building.', status: 'Active' },
  { id: 'type-2', name: 'House', description: 'Standalone residential home.', status: 'Active' },
  { id: 'type-3', name: 'Office', description: 'Commercial office space.', status: 'Active' },
  { id: 'type-4', name: 'Shop', description: 'Retail shop or store front.', status: 'Active' },
  { id: 'type-5', name: 'Warehouse', description: 'Large space for storage and logistics.', status: 'Active' },
  { id: 'type-6', name: 'Land', description: 'Empty plot of land for development.', status: 'Active' },
  { id: 'type-7', name: 'Commercial Building', description: 'Entire building for commercial use.', status: 'Active' }
];

// Generate 40 properties
export const initialProperties = Array.from({ length: 40 }).map((_, i) => {
  const types = ['type-1', 'type-1', 'type-2', 'type-2', 'type-3', 'type-4', 'type-5'];
  const typeId = types[i % types.length];
  const type = initialPropertyTypes.find(t => t.id === typeId).name;
  
  const locId = `loc-${(i % 8) + 1}`;
  const location = initialLocations.find(l => l.id === locId).name;
  
  const statuses = ['Available', 'Occupied', 'Reserved', 'Under Maintenance', 'Unavailable'];
  let status = statuses[i % 5];
  
  // Force some to be occupied
  if (i < 30) status = 'Occupied';
  
  const monthlyRent = 500 + (i * 150) + (typeId === 'type-3' ? 1000 : 0);
  
  return {
    id: `prop-${i + 1}`,
    code: `PRP-${1000 + i}`,
    name: `${type} at ${location}`,
    typeId: typeId,
    type: type, // string for easy display
    locationId: locId,
    location: location, // string for easy display
    address: `${100 + i} Main Street, ${location}`,
    bedrooms: type === 'Office' || type === 'Warehouse' || type === 'Land' || type === 'Shop' ? 0 : (i % 4) + 1,
    bathrooms: type === 'Land' ? 0 : (i % 2) + 1,
    size: 500 + (i * 120), // sqft
    monthlyRent: monthlyRent,
    tenantId: status === 'Occupied' ? `ten-${i + 1}` : null,
    availability: status === 'Occupied' ? 'Occupied' : (status === 'Available' ? 'Available' : 'Unavailable'),
    status: status,
    description: `A beautiful ${type.toLowerCase()} located in the heart of ${location}.`
  };
});

// Generate 30 tenants matching the 30 occupied properties
export const initialTenants = Array.from({ length: 30 }).map((_, i) => {
  const statuses = ['Active', 'Active', 'Active', 'Pending'];
  const rentStatuses = ['Paid', 'Paid', 'Partially Paid', 'Outstanding'];
  
  const prop = initialProperties.find(p => p.id === `prop-${i + 1}`);
  
  return {
    id: `ten-${i + 1}`,
    fullName: `Tenant Name ${i + 1}`,
    phone: `+1-555-01${i.toString().padStart(2, '0')}`,
    email: `tenant${i + 1}@example.com`,
    idNumber: `ID-999${i}`,
    propertyId: prop.id,
    monthlyRent: prop.monthlyRent,
    leaseStartDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-01`,
    leaseEndDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-01`,
    rentStatus: rentStatuses[i % 4],
    status: statuses[i % 4],
  };
});

// Generate 60 rent payment records
export const initialPayments = Array.from({ length: 60 }).map((_, i) => {
  const tenantId = `ten-${(i % 30) + 1}`;
  const tenant = initialTenants.find(t => t.id === tenantId);
  const propertyId = tenant.propertyId;
  const methods = ['Cash', 'Bank Transfer', 'Mobile Money', 'Card'];
  
  // Decide if fully paid
  const isFull = (i % 5) !== 0; // 4/5 fully paid, 1/5 partial
  const amountPaid = isFull ? tenant.monthlyRent : tenant.monthlyRent / 2;
  
  return {
    id: `pay-${i + 1}`,
    receiptNumber: `REC-2023-${1000 + i}`,
    tenantId: tenantId,
    propertyId: propertyId,
    paymentDate: `2023-11-${String((i % 28) + 1).padStart(2, '0')}`,
    rentAmount: tenant.monthlyRent,
    amountPaid: amountPaid,
    balance: tenant.monthlyRent - amountPaid,
    paymentMethod: methods[i % 4],
    referenceNumber: `REF-${Math.floor(Math.random() * 1000000)}`,
    status: isFull ? 'Completed' : 'Pending'
  };
});
