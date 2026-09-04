// src/redux/features/eventSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


const initialState = {
  events: [],
  event: null,
  registeredUsers: [],
  status: 'idle',
  error: null,
};

// The events API has returned both `{ events: [...] }` and a bare array in
// different environments. Keep the store shape stable regardless of which
// response format is received.
const getEventsFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.events)) return payload.events;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.events)) return payload.data.events;
  return [];
};

// Async thunk for event registration
export const registerForEvent = createAsyncThunk(
  'events/registerForEvent',
  async ({ eventId, token }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/events/${eventId}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Async thunk for fetching all events
export const fetchAllEvents = createAsyncThunk(
  'events/fetchAllEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/events/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Async thunk for fetching events by status
export const fetchEventsByStatus = createAsyncThunk(
  'events/fetchEventsByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/events/${status}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Async thunk for fetching event by ID
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/events/event/${eventId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEventErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerForEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.registeredUsers.push(action.payload);
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAllEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = getEventsFromPayload(action.payload);
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchEventsByStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEventsByStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = getEventsFromPayload(action.payload);
      })
      .addCase(fetchEventsByStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.event = action.payload.event;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearEventErrors } = eventSlice.actions;

export default eventSlice.reducer;
