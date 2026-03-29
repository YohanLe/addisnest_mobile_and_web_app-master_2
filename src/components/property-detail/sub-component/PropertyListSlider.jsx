import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Property1, Property2, Property3 } from "../../../assets/images";
import {
    SvgArrowLeftIcon,
    SvgArrowRightIcon,
    /* SvgClockIcon, */
    SvgFavoriteOutlineIcon, // Changed SvgFavoriteFillIcon to SvgFavoriteOutlineIcon
    SvgFavoriteOutlineIcon as SvgFavoriteIcon, // Assuming SvgFavoriteIcon should also be Outline
    SvgShareIcon,
} from "../../../assets/svg-files/SvgFiles";
import { formatDistanceToNow } from "date-fns";

const MakeFormat = (data) => {
    if (!data) return "Invalid date";

    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";

    return formatDistanceToNow(date, { addSuffix: true });
};

const PropertyListSlider = ({ HomeList }) => {
    const navigate = useNavigate();
    
    const GotoDetail = (item) => {
        window.scrollTo(0, 10);
        navigate(`/property-detail/${item?.id}`);
    }
    
    return (
        <div className="container">
            <div className="property-slider">
                <div className="property-slider-title">
                    <div className="property-slider-header">
                        <h4>Other Nearby Homes to Explore</h4>
                        <p>
                            Nearby listings like 2197 Zinnia St range from ETB 585K to ETB 2M,
                            averaging ETB 420 per square foot.
                        </p>
                    </div>
                    <div className="all-view">
                        <Link to="#">View all</Link>
                    </div>
                </div>
                <div className="property-list">
                    <div className="property-slider-aroow">
                        <span>
                            <SvgArrowLeftIcon />
                        </span>
                        <span>
                            <SvgArrowRightIcon />
                        </span>
                    </div>
                    <ul>
                        {HomeList && HomeList.slice(0, 3).map((item, index) => (
                            <li key={index}>
                                <a onClick={() => {GotoDetail(item)}} className="property-card">
                                    <div className="card">
                                        <div
                                            className="property-img"
                                            style={{ backgroundImage: `url(${item?.media[0]?.filePath})` }}
                                        >
                                            <span>{item.status}</span>
                                            <p>
                                                {/* <em>
                                                    <SvgClockIcon />
                                                </em> */}
                                                {MakeFormat(item?.createdAt)}
                                            </p>
                                        </div>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <h3>{item.price}</h3>
                                                <div className="property-share-icon">
                                                    <span>
                                                        <SvgShareIcon />
                                                    </span>
                                                    <span>
                                                        {item?.is_wishlist === true ? <SvgFavoriteOutlineIcon /> : <SvgFavoriteIcon />}
                                                    </span>
                                                </div>
                                                <div className="property-area">
                                                    <span>{item?.beds} bed</span>
                                                    <span>
                                                        <em></em>
                                                        {item?.bathroom_information?.length} bath
                                                    </span>
                                                    <span>
                                                        <em></em>{item?.property_size} sqm.
                                                    </span>
                                                </div>
                                                <p>{item?.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PropertyListSlider;
