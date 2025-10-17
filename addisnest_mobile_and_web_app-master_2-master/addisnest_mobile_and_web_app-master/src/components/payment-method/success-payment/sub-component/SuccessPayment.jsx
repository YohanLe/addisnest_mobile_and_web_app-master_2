import React from "react";
import { useNavigate } from "react-router-dom";
import { SvgCheckCircleIcon, SvgLongArrowIcon } from "../../../../assets/svg/Svg";

const SuccessPayment = () => {
    const navigate = useNavigate();

    const handleViewListing = () => {
        // Navigate to Account Management, which will then redirect to My Listings (Dashboard)
        navigate('/account-management', {
            state: {
                fromPromotion: true,
                redirectToMyListings: true
            }
        });
    };

    return (
        <div className="success-payment-section">
            <div className="container">
                <div className="progressbar-main">
                    <ul>
                        <li>
                            <div className="progress-step active">
                                <span></span>
                                <p>Choose Promotion</p>
                            </div>
                        </li>
                        <li>
                            <div className="progress-step active">
                                <span></span>
                                <p>Make Payment</p>
                            </div>
                        </li>
                        <li>
                            <div className="progress-step done">
                                <span></span>
                                <p>Confirmation</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="pymt-succes-icon">
                            <SvgCheckCircleIcon />
                        </div>
                        <div className="pymet-success-title">
                            <h3>Thanks for your payment</h3>
                            <p>Congratulations!! Your Ad is now live</p>
                        </div>
                        <div className="pymt-success-btn">
                            <button onClick={handleViewListing} className="btn ">
                                View Listing
                                <span>
                                    <SvgLongArrowIcon />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPayment;
