import React from 'react';
import { EthionestIcon1, EthionestIcon2, EthionestIcon3 } from '../../../assets/images';
import { SvgLocationIcon } from '../../../assets/svg-files/SvgFiles';
import { Link } from 'react-router-dom';

const EthionestOffersSection = () => {
  return (
    <section className="common-section ethionest-offers-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-title text-center">
              <h2>What We Offer</h2>
              <p>Find the perfect property solution for your needs</p>
            </div>
          </div>
        </div>
        
        <div className="row ethionest-offers">
          <div className="col-md-4">
            <div className="offer-item">
              <div className="offer-icon">
                <img src={EthionestIcon1} alt="Buy" />
              </div>
              <div className="offer-content">
                <h3>Buy a Home</h3>
                <p>Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else.</p>
                <Link to="/property-list" className="offer-link">
                  Browse Properties <SvgLocationIcon />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="offer-item">
              <div className="offer-icon">
                <img src={EthionestIcon2} alt="Sell" />
              </div>
              <div className="offer-content">
                <h3>Sell a Home</h3>
                <p>No matter what path you take to sell your home, we can help you navigate a successful sale with our expert support.</p>
                <Link to="/sell" className="offer-link">
                  List Your Property <SvgLocationIcon />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="offer-item">
              <div className="offer-icon">
                <img src={EthionestIcon3} alt="Rent" />
              </div>
              <div className="offer-content">
                <h3>Rent a Home</h3>
                <p>We're creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.</p>
                <Link to="/rent" className="offer-link">
                  Find Rentals <SvgLocationIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EthionestOffersSection;
