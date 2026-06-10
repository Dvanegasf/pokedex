import { createSlice } from "@reduxjs/toolkit"

const trainer = createSlice({
    name: 'trainer',
    initialState: localStorage.getItem('trainer') || '',
    reducers: {
        setTrainer: (_state, action) => {
            localStorage.setItem('trainer', action.payload);
            return action.payload;
        },
        clearTrainer: () => {
            localStorage.removeItem('trainer');
            return '';
        }
    }
});

export const { setTrainer, clearTrainer } = trainer.actions;

export default trainer.reducer;