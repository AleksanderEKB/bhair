// front/src/app/rootReducer.tsx
import { combineReducers } from 'redux';
import authReducer from '../features/auth/model/authSlice';
import servicesReducer from '../features/services/model/slice';


const rootReducer = combineReducers({
    auth: authReducer,
    services: servicesReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
