import { combineReducers } from 'redux';
import { bank, banks } from './banks';
import { bankFields, bankFieldsReducer } from './bank-fields';

/**
 * Данные стора
 */
export interface storeState {
  banks: bank[];
  bankFields?: bankFields;
}

export default combineReducers({
  banks,
  bankFields: bankFieldsReducer,
});
