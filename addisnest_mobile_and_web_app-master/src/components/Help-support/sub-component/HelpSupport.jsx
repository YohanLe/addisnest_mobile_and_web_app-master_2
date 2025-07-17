import React, { useState } from "react";
import { LogoIcon } from "../../../assets/images";
import { Link } from "react-router-dom";
import {
  SvgLongArrowIcon,
  SvgSearchIcon,
} from "../../../assets/svg-files/SvgFiles";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sample FAQ data for demonstration
  const faqTopics = [
    {
      id: 1,
      title: "Account Management",
      questions: [
        "How do I reset my password?",
        "How do I update my profile information?",
        "Can I have multiple accounts?"
      ]
    },
    {
      id: 2,
      title: "Property Listings",
      questions: [
        "How do I list my property?",
        "Can I edit my listing after it's published?",
        "How long does my listing stay active?"
      ]
    },
    {
      id: 3,
      title: "Payments & Billing",
      questions: [
        "What payment methods do you accept?",
        "How do I view my billing history?",
        "Do you offer refunds?"
      ]
    }
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search functionality
    // In a real implementation, this would likely make an API call
    setTimeout(() => {
      const results = [];
      
      // Search through FAQ topics and questions
      faqTopics.forEach(topic => {
        const matchingQuestions = topic.questions.filter(question => 
          question.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (matchingQuestions.length > 0) {
          results.push({
            topic: topic.title,
            questions: matchingQuestions
          });
        }
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  return (
    <>
      <section className="common-section help-support-section">
        <div className="container">
          <div className="hlpsupporty-main">
            {/* Search Section */}
            <div className="hlpsupport-srchtp">
              <div className="hlpsuport-logo">
                <img src={LogoIcon} alt="Company Logo" />
              </div>
              <div className="hlpsuport-srch">
                <h3>How can we help you?</h3>
                <form onSubmit={handleSearch} className="findagent-srcg-input">
                  <input 
                    type="text" 
                    placeholder="Search help topics" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search help topics"
                  />
                  <button type="submit" className="btn btn-primary" aria-label="Search">
                    <SvgLongArrowIcon />
                  </button>
                </form>
                
                {/* Search Results */}
                {isSearching && (
                  <div className="search-loading">Searching...</div>
                )}
                
                {!isSearching && searchResults.length > 0 && (
                  <div className="search-results">
                    <h4>Search Results</h4>
                    {searchResults.map((result, index) => (
                      <div key={index} className="search-result-group">
                        <h5>{result.topic}</h5>
                        <ul>
                          {result.questions.map((question, qIndex) => (
                            <li key={qIndex}>
                              <Link to="#">{question}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                
                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="no-results">
                    No results found for "{searchQuery}". Try different keywords or 
                    <Link to="#" className="contact-support-link"> contact support</Link>.
                  </div>
                )}
              </div>
            </div>
            
            {/* Help Topics Section */}
            <div className="hlpsupport-list">
              <div className="hlpsupport-desp">
                <h3>Need Assistance? We're Here to Help!</h3>
                <p>
                  Whether you have questions about buying, selling, or
                  navigating our platform, our support team is ready to assist
                  you every step of the way.
                </p>
              </div>
              
              <div className="hlpsupport-desp">
                <h3>Frequently Asked Questions</h3>
                <p>
                  Find quick answers to the most common questions about using
                  our platform, managing listings, and more.
                </p>
                <div className="faq-topics">
                  {faqTopics.map(topic => (
                    <div key={topic.id} className="faq-topic-item">
                      <h4>{topic.title}</h4>
                      <Link to={`/faq/${topic.id}`} className="view-topic-link">
                        View topics <span className="arrow-icon">→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="hlpsupport-desp">
                <h3>Contact Support</h3>
                <p>
                  For personalized assistance, reach out to our support team via
                  chat, email, or phone
                </p>
                <div className="hlpsupport-inner-list">
                  <p>
                    <span className="contact-icon"></span> 
                    <em>Live Chat:</em> Available 24/7 for instant help.
                    <Link to="/chat" className="contact-action-link">Start Chat</Link>
                  </p>
                  <p>
                    <span className="contact-icon"></span>
                    <em>Email Us:</em> Send us an email, and we'll respond
                    within 24 hours.
                    <a href="mailto:support@addisnest.com" className="contact-action-link">
                      support@addisnest.com
                    </a>
                  </p>
                  <p>
                    <span className="contact-icon"></span> 
                    <em>Phone Support:</em> Call us directly at 
                    <a href="tel:+1234567890" className="contact-action-link">
                      (123) 456-7890
                    </a> 
                    for immediate assistance.
                  </p>
                </div>
              </div>
              
              <div className="hlpsupport-desp">
                <h3>Guides & Resources</h3>
                <p>
                  Explore step-by-step guides, tips, and articles designed to
                  help you make the most of our platform.
                </p>
                <div className="resource-links">
                  <Link to="/guides/getting-started" className="resource-link">
                    Getting Started Guide
                  </Link>
                  <Link to="/guides/property-listing" className="resource-link">
                    Property Listing Tips
                  </Link>
                  <Link to="/guides/market-trends" className="resource-link">
                    Real Estate Market Trends
                  </Link>
                </div>
              </div>
              
              <div className="hlpsupport-desp">
                <h3>Become an Expert</h3>
                <p>
                  For more in-depth support, learn about our premium assistance
                  options, including dedicated agent support and personalized
                  market insights.
                </p>
                <Link to="/premium-support" className="btn btn-outline-primary mt-3">
                  Learn More About Premium Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HelpSupport;
