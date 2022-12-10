import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from './counter.actions';

export const initialState = "";

export const counterReducer = createReducer(
  initialState,
  on(increment, (state, result) => result.message),
  on(decrement, (state) => ""),
  on(reset, (state) => "")
);
