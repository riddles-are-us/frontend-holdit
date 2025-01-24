import { createSlice } from '@reduxjs/toolkit';
import { RootState } from "../../app/store";
import { queryState } from "../../games/request";
import { ResourceAmountPair, ResourceType, emptyResources, getResources } from './models';

interface ResourcesState {
    resources: ResourceAmountPair;
}

const initialState: ResourcesState = {
    resources: emptyResources,
};

export const resourcesSlice = createSlice({
    name: 'resources',
    initialState,
    reducers: {
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(queryState.fulfilled, (state, action) => {
            state.resources = getResources(action.payload.player?.data.balance);
        });
    }
  },
);

export const selectResources = (state: RootState) => state.holdit.resources.resources;
export const selectResource = (type: ResourceType) => (state: RootState) => state.holdit.resources.resources.amount;
    
// export const { } = resourcesSlice.actions;
export default resourcesSlice.reducer;