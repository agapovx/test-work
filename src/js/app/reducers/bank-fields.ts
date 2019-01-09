export interface bankFields {
  bik: string;
  name: string;
  account: string;
  address: string;
}

const initialBankFields: bankFields = {
  bik: '',
  name: '',
  account: '',
  address: '',
};

export const bankFieldsReducer = (state = initialBankFields, action) => {
  switch (action.type) {
    case SAVE_BANK_FIELDS: {
      return action.data;
    }
    case RESET_BANK_FIELDS: {
      return state;
    }
    default:
      return state;
  }
};

/**
 * Типы экшенов
 */
export const SAVE_BANK_FIELDS = 'SAVE_BANK_FIELDS';
export const RESET_BANK_FIELDS = 'RESET_BANK_FIELDS';
