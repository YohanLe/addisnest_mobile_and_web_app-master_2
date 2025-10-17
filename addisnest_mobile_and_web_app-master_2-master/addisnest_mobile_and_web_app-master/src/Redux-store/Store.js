import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import {
    ServicesListSlice,
    AuthSlice,
    ChatlistSlice,
    ClientlistSlice,
    TicketListSlice,
    HomeSlice,
    CitylistSlice,
    WishListSlice,
    AgentAllSlice,
    AgentDetailsSlice,
    LocationaddSlice,
    PropertyListSlice,
    RatesListSlice
} from "./Slices";
import PropertyDetailSlice from "./Slices/PropertyDetailSlice";
import PaymentSlice from "./Slices/PaymentSlice";
import AgentSlice from "./Slices/AgentSlice";


const persistConfig = {
    key: "root",
    storage,
};
const rootReducer = combineReducers({
    Auth: persistReducer(persistConfig, AuthSlice),
    Home: HomeSlice,
    Citylist: CitylistSlice,
    TicketList:TicketListSlice,
    Clientlist:ClientlistSlice,
    Chatlist:ChatlistSlice,
    ServicesList:ServicesListSlice,
    RatesList:RatesListSlice,
    WishList:WishListSlice,
    PropertyDetail:PropertyDetailSlice,
    PropertyList:PropertyListSlice,
    AgentAll:AgentAllSlice,
    AgentDetails:AgentDetailsSlice,
    Locationadd:persistReducer(persistConfig, LocationaddSlice),
    Payments: PaymentSlice,
    Agents: AgentSlice
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

const persistedStore = persistStore(store);

export { store, persistedStore };
