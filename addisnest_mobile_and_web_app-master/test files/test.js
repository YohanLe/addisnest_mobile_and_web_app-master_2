import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import ChoosePromotion from './src/components/payment-method/choose-propmo/sub-component/ChoosePropmotionFixed.jsx';
import Api from './src/Apis/Api';

// Mock the API module
jest.mock('./src/Apis/Api');

describe('ChoosePromotion Component', () => {
  const mockPropertyData = {
    title: 'Test Property',
    description: 'A beautiful property for testing.',
    propertyType: 'House',
    offeringType: 'For Sale',
    price: 100000,
    area: 150,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Parking', 'Garden'],
    furnishingStatus: 'Furnished',
    images: [{ url: 'test-image.jpg' }],
    // Intentionally missing address fields to test the fix
  };

  test('should not send fallback address values when address data is missing', async () => {
    // Mock the API response
    Api.postWithtoken.mockResolvedValue({ data: { _id: '12345' } });

    render(
      <MemoryRouter initialEntries={[{ state: { AllData: mockPropertyData } }]}>
        <ChoosePromotion />
      </MemoryRouter>
    );

    // Select a plan
    fireEvent.click(screen.getByText('Basic Plan - Free'));

    // Click continue
    fireEvent.click(screen.getByText('Continue'));

    // Check the payload sent to the API
    expect(Api.postWithtoken).toHaveBeenCalledWith(
      'properties',
      expect.objectContaining({
        street: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
      })
    );
  });
});
