import React from 'react';
import { TestimonialIcon, Agent1, Agent2, Agent3 } from '../../../assets/images';
import { SvgstarfillIcon, SvgstaroutlineIcon } from '../../../assets/svg-files/SvgFiles';
import ClientSlider from '../../helper/ClientSlider';

const TestimonialSection = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'John Smith',
      position: 'Homeowner',
      avatar: Agent1,
      stars: 5,
      testimonial: 'Working with our team was a game-changer for our family. We found our dream home in just two weeks! The platform is intuitive and the agents are incredibly knowledgeable about the Ethiopian market.'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Property Investor',
      avatar: Agent2,
      stars: 5,
      testimonial: 'As an investor, I need reliable market information and connections with serious sellers. Our platform provided both. Their property listings are detailed and accurate, and their agent network is unmatched.'
    },
    {
      id: 3,
      name: 'Michael Abebe',
      position: 'First-time Buyer',
      avatar: Agent3,
      stars: 5,
      testimonial: 'I was nervous about buying my first property, but they made the process smooth and transparent. Their mortgage calculator and neighborhood guides were incredibly helpful in making my decision.'
    }
  ];

  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(<SvgstarfillIcon key={i} />);
    }
    return stars;
  };

  return (
    <section className="common-section testimonial-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-title text-center">
              <h2>What Our Clients Are Saying</h2>
              <p>Thousands of satisfied customers trust us for their real estate needs</p>
            </div>
          </div>
        </div>
        
        <ClientSlider>
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-item">
              <div className="testimonial-content">
                <div className="testimonial-text">
                  <p>"{item.testimonial}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image">
                    <img src={item.avatar} alt={item.name} />
                  </div>
                  <div className="author-info">
                    <h5>{item.name}</h5>
                    <p>{item.position}</p>
                    <div className="rating">
                      {renderStars(item.stars)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ClientSlider>
      </div>
    </section>
  );
};

export default TestimonialSection;
