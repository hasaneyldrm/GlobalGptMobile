import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreditState {
  userCredit: number;
}

const initialState: CreditState = {
  userCredit: 0,
};

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    setUserCredit: (state, action: PayloadAction<number>) => {
      state.userCredit = action.payload;
    },
    addUserCredit: (state, action: PayloadAction<number>) => {
      state.userCredit += action.payload;
    },
    subtractUserCredit: (state, action: PayloadAction<number>) => {
      state.userCredit = Math.max(0, state.userCredit - action.payload);
    },
    resetUserCredit: (state) => {
      state.userCredit = 0;
    },
  },
});

export const { 
  setUserCredit, 
  addUserCredit, 
  subtractUserCredit, 
  resetUserCredit 
} = creditSlice.actions;

export default creditSlice.reducer;
