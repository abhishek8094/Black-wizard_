
export const getDefaultAddress = (addressesData) => {
  if (!addressesData?.data || !Array.isArray(addressesData.data)) {
    return null;
  }

  return addressesData.data.find(address => address.defaultAddress === true) || null;
};

export const formatAddressForDisplay = (address) => {
  if (!address) {
    return {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: ''
    };
  }

  return {
    name: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
    street: `${address.address || ''}${address.apartmentSuite ? `, ${address.apartmentSuite}` : ''}`,
    city: address.city || '',
    state: address.state || '',
    zip: address.pinCode || '',
    country: address.countryRegion || '',
    phone: address.phone || ''
  };
};

export const getFormattedDefaultAddress = (addressesData) => {
  const defaultAddress = getDefaultAddress(addressesData);
  return formatAddressForDisplay(defaultAddress);
};
