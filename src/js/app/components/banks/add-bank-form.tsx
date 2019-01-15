import { findIndex } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import { bank } from '../../reducers/banks';
import { storeState } from '../../reducers/reducers';
import { ADD_BANK } from '../../reducers/banks';
import { BankLogic, BankLogicProps, BankLogicState } from './bank-logic';
import { bankFields, SAVE_BANK_FIELDS, RESET_BANK_FIELDS } from '../../reducers/bank-fields';
import Button from '../fragments/button';
import * as cn from 'classnames';
import { AddBankByBik } from './add-bank-by-bik';

interface AddBankFormProps extends BankLogicProps {
  addBank: (bank: bank) => void;
  saveFields: (bankFields: bankFields) => void;
  resetStoreFields: () => void;
  bankFields: bankFields;
}

enum ADD_TYPE {
  manually = 'manually',
  online = 'online',
}

interface AddBankFormState extends BankLogicState {
  successfullyPushedData: boolean;
  addType: string;
}

/**
 * Форма для добавления банка в стор
 */
export class AddBankForm extends BankLogic<AddBankFormProps, AddBankFormState> {
  constructor(props: AddBankFormProps) {
    super(props);

    this.state = {
      bik: this.props.bankFields.bik,
      name: this.props.bankFields.name,
      account: this.props.bankFields.account,
      address: this.props.bankFields.address,
      errorFields: [],
      successfullyPushedData: false,
      addType: ADD_TYPE.manually,
    };
  }

  componentWillUnmount() {
    //Проверяем есть ли данные в полях стэйта. Если есть, отправляем их в стор
    if (!this._checkFields()) {
      const bankFields: bankFields = this._buildFieldsData();
      this.props.saveFields(bankFields);
    }
  }

  _buttonTitle = 'Добавить';

  render() {
    if (this.state.successfullyPushedData) return this._renderSuccess();
    return (
      <section className="add-bank-form">
        <h2 className="abf_title">Добавить банк</h2>
        <div className="abf_add-type-wrapper">
          <Button
            onClick={this._setManuallyType}
            extraClass={cn('abf_switch-type-button', { ignored: this.state.addType === ADD_TYPE.online })}>
            Вручную
          </Button>
          <Button
            onClick={this._setOnlineType}
            extraClass={cn('abf_switch-type-button', { ignored: this.state.addType === ADD_TYPE.manually })}>
            БИК Онлайн
          </Button>
        </div>
        {this.state.addType === ADD_TYPE.manually ? this._renderFields() : this._renderAddOnline()}
      </section>
    );
  }

  private _setManuallyType = () => {
    this.setState({ addType: ADD_TYPE.manually });
  };

  private _setOnlineType = () => {
    // сбрасываем поля с ошибками при переходе на другой тип добавления
    this.setState({ errorFields: [] });
    this.setState({ addType: ADD_TYPE.online });
  };

  protected _renderAddManual = () => {
    this._renderFields();
  };

  protected _renderAddOnline = () => {
    return (
      <AddBankByBik
        setSuccess={this._setSuccess}
        addBank={this._addBank}
        checkBik={this._checkBik}
        banksLength={this.props.banks.length}
      />
    );
  };

  protected _renderSuccess() {
    return (
      <div className="success-wrapper">
        <div className="sw_title">Банк был успешно добавлен</div>
        <Button extraClass="sw_success-button" onClick={this._disableSuccess}>
          Понял, принял :)
        </Button>
      </div>
    );
  }

  /**
   * Проверяем бик банка на доступность
   */
  protected _checkBik = (bik?: string): boolean => {
    // если нет данных о банках, значит БИК точно свободен
    if (this.props.banks.length === 0) return true;

    const stateBikValue: string = bik ? bik : this.state.bik;

    return findIndex(this.props.banks, (bank: bank) => bank.bik === stateBikValue) !== -1 ? false : true;
  };

  /**
   * Сбрасываем поля, собираем объект банка и отправляем его в стор
   */
  protected _pushData = (): void => {
    this._resetFields();
    const bank: bank = this._buildBankFromState();
    this._addBank(bank);
    this._setSuccess();
  };

  private _addBank = (bank: bank) => {
    this.props.addBank(bank);
  };

  private _setSuccess = (): void => {
    this.setState({ successfullyPushedData: true });
  };

  private _disableSuccess = (): void => {
    this.setState({ successfullyPushedData: false });
  };

  private _resetFields = (): void => {
    this.props.resetStoreFields();
    this.setState({
      account: '',
      name: '',
      bik: '',
      address: '',
      errorFields: [],
    });
  };

  /**
   * Возвращает булево значение пустые ли поля о данных банка в стэйте
   */
  private _checkFields = (): boolean => {
    const { bik, address, account, name } = this.state;
    if (bik || address || account || name) return false;
    return true;
  };

  private _buildFieldsData = (): bankFields => {
    return {
      bik: this.state.bik,
      account: this.state.account,
      address: this.state.account,
      name: this.state.name,
    };
  };
}

const mapStateToProps = (state: storeState) => {
  return {
    banks: state.banks,
    bankFields: state.bankFields,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addBank: (bank: bank) => {
      dispatch({ type: ADD_BANK, data: bank });
    },
    saveFields: (bankFields: bankFields) => {
      dispatch({ type: SAVE_BANK_FIELDS, data: bankFields });
    },
    resetStoreFields: () => {
      dispatch({ type: RESET_BANK_FIELDS, data: {} });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBankForm);
