import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyDetail from './PropertyDetail';

const mockPropertyDetails = {
  features: {
    'parking-space': true,
    'garage': true,
    '24-7-security': true,
    'cctv-surveillance': true,
    'gym-fitness-center': true,
    'swimming-pool': true,
    'laundry': true,
    'garden-yard': true,
    'elevator': true,
  },
  media: ['image1.jpg'],
  title: 'Test Property',
  property_address: '123 Test St',
  total_price: 500000,
};

test('renders property features in a 3-column grid', () => {
  render(<PropertyDetail PropertyDetails={mockPropertyDetails} />);
  
  const featuresContainer = screen.getByText('Property Features').parentElement.querySelector('div');
  
  expect(featuresContainer).toHaveStyle('display: grid');
  expect(featuresContainer).toHaveStyle('grid-template-columns: repeat(3, 1fr)');
});
