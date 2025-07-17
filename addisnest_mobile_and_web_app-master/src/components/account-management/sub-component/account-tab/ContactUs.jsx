import React, { useState } from "react";

const ContactUs = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would send this data to an API
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    // Show success message
    alert("Your message has been sent. We'll get back to you soon!");
  };

  return (
    <div className="contact-us-container">
      <div className="contact-header">
        <h2>Contact Us</h2>
        <p>Have questions or need assistance? Reach out to our support team.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-item">
            <i className="bi bi-envelope"></i>
            <div>
              <h4>Email</h4>
              <p>support@addisnest.com</p>
            </div>
          </div>
          <div className="info-item">
            <i className="bi bi-telephone"></i>
            <div>
              <h4>Phone</h4>
              <p>+1 (123) 456-7890</p>
            </div>
          </div>
          <div className="info-item">
            <i className="bi bi-clock"></i>
            <div>
              <h4>Hours</h4>
              <p>Monday - Friday: 9am - 5pm</p>
              <p>Weekend: Closed</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-submit">Send Message</button>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-list">
          <div className="faq-item">
            <h4>How do I list my property?</h4>
            <p>Navigate to "Listed Property" in your account menu and click on "Add New Property" to start the listing process.</p>
          </div>
          <div className="faq-item">
            <h4>How long does it take to review my listing?</h4>
            <p>Property listings are typically reviewed within 24-48 hours before they go live on the platform.</p>
          </div>
          <div className="faq-item">
            <h4>Can I edit my property listing after it's published?</h4>
            <p>Yes, you can edit your property listing anytime by going to "Listed Property" and selecting the listing you want to modify.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
