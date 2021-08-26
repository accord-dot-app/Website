import { createSlice, createSelector } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';
import { token } from './utils/rest-headers';

const slice = createSlice({
  name: 'users',
  initialState: [] as Store.AppState['entities']['users'],
  reducers: {
    fetched: (users, { payload }: Store.Action<Entity.User[]>) => {
      // FIXME: does not work with unique
      users.push(...payload);
    },
    updated: (users, { payload }: Store.Action<WS.Args.UserUpdate>) => {
      const user = users.find(u => u.id === payload.userId);
      if (user) Object.assign(user, payload.partialUser);
    },
    deleted: (users, { payload }: Store.Action<WS.Args.UserDelete>) => {
      const index = users.findIndex(u => u.id === payload.userId);
      users.splice(index, 1);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const updateSelf = (payload: Partial<Entity.User>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'USER_UPDATE',
    data: { ...payload, token: token() } as WS.Params.UserUpdate,
  }));
}

export const deleteSelf = () => (dispatch) => {
  dispatch(api.wsCallBegan({
    data: { token: token() },
    event: 'USER_DELETE',
  }));
}

export const getUser = (id: string) =>
  createSelector<Store.AppState, Entity.User[], Entity.User | undefined>(
    state => state.entities.users,
    users => users.find(u => u.id === id),
  );
