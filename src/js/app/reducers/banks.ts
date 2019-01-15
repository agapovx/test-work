import { concat, findIndex, without } from 'lodash';

/**
 * Получаем список банов из localstorage. Если есть данные, тогда возвращаем их, приведя в JSON формат
 * Иначе возвращаем пустой массив
 */
const initialBankList = (): bank[] | [] => {
  const localStorageValues: string | null = localStorage.getItem('banks');
  if (localStorageValues) {
    return JSON.parse(localStorageValues);
  }
  return [];
};

export interface bank {
  bik: string;
  name: string;
  account: string;
  address: string;
  id: number;
}

export const banks = (state = initialBankList(), action) => {
  switch (action.type) {
    case ADD_BANK: {
      return addNewBank(state, action.data);
    }
    case EDIT_BANK: {
      return editBank(state, action.data);
    }
    case DELETE_BANK: {
      return deleteBank(state, action.data);
    }
    default:
      return state;
  }
};

const addNewBank = (banks: bank[], newBank: bank) => {
  const result: bank[] = [...banks, newBank];
  pushDataToStorage(result);
  return result;
};

const editBank = (banks: bank[], updatedBank: bank) => {
  const bankKey: number = findIndex(banks, (bank: bank) => bank.id === updatedBank.id);

  let updatedBanksData = [...banks];
  updatedBanksData.splice(bankKey, 1, updatedBank);

  pushDataToStorage(updatedBanksData);
  return updatedBanksData;
};

const deleteBank = (banks: bank[], removedBank: bank) => {
  const result: bank[] = without(banks, removedBank);
  pushDataToStorage(result);
  return result;
};

const pushDataToStorage = (banks: bank[]): void => {
  localStorage.setItem('banks', JSON.stringify(banks));
};

/**
 * Типы экшенов
 */
export const ADD_BANK = 'ADD_BANK';
export const DELETE_BANK = 'DELETE_BANK';
export const EDIT_BANK = 'EDIT_BANK';
