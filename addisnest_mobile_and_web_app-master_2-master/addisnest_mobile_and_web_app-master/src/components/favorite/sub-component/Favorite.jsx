import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { /* SvgClockIcon, */ SvgFavoriteOutlineIcon } from "../../../assets/svg-files/SvgFiles"; // Changed to SvgFavoriteOutlineIcon
import { useDispatch, useSelector } from "react-redux";
import { GetWishList } from "../../../Redux-store/Slices/WishListSlice";
import { formatDistanceToNow } from "date-fns";
import Api from "../../../Apis/Api";

const MakeFormat = (data) => {
    if (!data) return "Invalid date";
    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";
    return formatDistanceToNow(date, { addSuffix: true });
};

const Favorite = () => {
    const dispatch = useDispatch();
    const WishData = useSelector((state) => state.WishList?.data || {});
    const WishList = WishData?.data?.data || [];
    
    useEffect(() => {
        try {
            dispatch(GetWishList());
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    }, [dispatch]);

    const WishlistAddFun = async (item) => {
        let body = {
            propertyId: item?.propertyId || item?.property?.id,
        };
        
        try {
            const response = await Api.postWithtoken("wishlist/add-remove", body);
            const { message } = response;
            toast.success(message || "Wishlist updated successfully");
            dispatch(GetWishList());
        } catch (error) {
            console.error('Error updating wishlist:', error);
            toast.error("Failed to update wishlist. Please try again.");
        }
    }

    // Display fallback content if no wishlist items
    if (!WishList || WishList.length === 0) {
        return (
            <section className="common-section favorite-main-section">
                <div className="container">
                    <div className="favorite-empty">
                        <h2>No Favorite Properties</h2>
                        <p>Properties you mark as favorite will appear here.</p>
                        <Link to="/property-list" className="btn btn-primary">
                            Browse Properties
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="common-section favorite-main-section">
            <div className="container">
                <div className="section-title">
                    <h2>My Favorite Properties</h2>
                    <p>Manage your saved properties</p>
                </div>
                <div className="property-list">
                    <ul>
                        {WishList.map((item, index) => (
                            <li key={index}>
                                <div className="property-card">
                                    <div className="card">
                                        <Link to={`/property-detail/${item?.property?.id}`}>
                                            <div
                                                className="property-img"
                                                style={{
                                                    backgroundImage: item?.property?.media?.length > 0 
                                                        ? `url(${item?.property?.media[0].filePath})` 
                                                        : "none"
                                                }}
                                            >
                                                {item?.property?.status && (
                                                    <span className="property-status">{item?.property?.status}</span>
                                                )}
                                                <p className="property-time">
                                                    {/* <em>
                                                        <SvgClockIcon />
                                                    </em> */}
                                                    {MakeFormat(item?.property?.createdAt)}
                                                </p>
                                            </div>
                                        </Link>
                                        <div 
                                            className="favorite-icon"
                                            onClick={() => WishlistAddFun(item)}
                                        >
                                            <SvgFavoriteOutlineIcon /> {/* Changed to SvgFavoriteOutlineIcon */}
                                        </div>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <Link to={`/property-detail/${item?.property?.id}`}>
                                                    <h3>${item?.property?.price?.toLocaleString() || "Price not available"}</h3>
                                                </Link>
                                                <div className="property-area">
                                                    {item?.property?.beds && (
                                                        <span>{item?.property?.beds} bed</span>
                                                    )}
                                                    {item?.property?.bathroom_information && (
                                                        <span>
                                                            <em></em>
                                                            {typeof item?.property?.bathroom_information === 'object' 
                                                                ? item?.property?.bathroom_information.length 
                                                                : item?.property?.bathroom_information} bath
                                                        </span>
                                                    )}
                                                    {item?.property?.property_size && (
                                                        <span>
                                                            <em></em>{item?.property?.property_size} sqm.
                                                        </span>
                                                    )}
                                                </div>
                                                {item?.property?.address && (
                                                    <p className="property-address">{item.property?.address}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Favorite;
