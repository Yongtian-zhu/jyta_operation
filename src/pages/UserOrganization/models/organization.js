import { getzz } from '@/services/api';

export default {
  namespace: 'organization',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    formList: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(getzz, payload);
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
        // formList: action.payload.search   //  form 表单接
      };
    }
  },
};
