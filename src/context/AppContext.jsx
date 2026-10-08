import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  initialProperties, 
  initialPropertyTypes, 
  initialLocations, 
  initialTenants, 
  initialPayments 
} from '../data/mockData';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useLocalStorage('propMgmt_properties_v2', initialProperties);
  const [propertyTypes, setPropertyTypes] = useLocalStorage('propMgmt_propertyTypes_v2', initialPropertyTypes);
  const [locations, setLocations] = useLocalStorage('propMgmt_locations_v2', initialLocations);
  const [tenants, setTenants] = useLocalStorage('propMgmt_tenants_v2', initialTenants);
  const [payments, setPayments] = useLocalStorage('propMgmt_payments_v2', initialPayments);

  // Property CRUD
  const addProperty = (prop) => setProperties([...properties, prop]);
  const updateProperty = (id, updated) => setProperties(properties.map(p => p.id === id ? updated : p));
  const deleteProperty = (id) => setProperties(properties.filter(p => p.id !== id));

  // Tenant CRUD
  const addTenant = (tenant) => setTenants([...tenants, tenant]);
  const updateTenant = (id, updated) => setTenants(tenants.map(t => t.id === id ? updated : t));
  const deleteTenant = (id) => setTenants(tenants.filter(t => t.id !== id));

  // Payments CRUD
  const addPayment = (payment) => setPayments([...payments, payment]);
  const updatePayment = (id, updated) => setPayments(payments.map(p => p.id === id ? updated : p));
  const deletePayment = (id) => setPayments(payments.filter(p => p.id !== id));

  // Locations CRUD
  const addLocation = (loc) => setLocations([...locations, loc]);
  const updateLocation = (id, updated) => setLocations(locations.map(l => l.id === id ? updated : l));
  const deleteLocation = (id) => setLocations(locations.filter(l => l.id !== id));

  // Types CRUD
  const addType = (type) => setPropertyTypes([...propertyTypes, type]);
  const updateType = (id, updated) => setPropertyTypes(propertyTypes.map(t => t.id === id ? updated : t));
  const deleteType = (id) => setPropertyTypes(propertyTypes.filter(t => t.id !== id));

  const value = {
    properties, addProperty, updateProperty, deleteProperty,
    propertyTypes, addType, updateType, deleteType,
    locations, addLocation, updateLocation, deleteLocation,
    tenants, addTenant, updateTenant, deleteTenant,
    payments, addPayment, updatePayment, deletePayment
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
