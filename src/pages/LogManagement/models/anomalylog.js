import {getyc} from '@/services/api';

export default {
  namespace: 'anomalylog',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    formList: [],
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(getyc, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        formList:action.payload.search
      };
    }
  },
};
