import * as React from 'react';
import { bank } from '../../reducers/banks';
import Button, { ButtonType } from '../fragments/button';
import { Error } from '../fragments/error';
import { FieldInput } from '../fragments/field-input';

export interface BankLogicProps {
  banks: bank[];
}

export interface BankLogicState {
  bik: string;
  name: string;
  account: string;
  address: string;
  errorFields: string[];
}

/**
 * Все типы ошибок с сообщениями
 */
const errors = {
  bik: 'Заполните поле БИК',
  bikValid: 'БИК должен состоять из 9 символов',
  notAvaliable: 'Банк с данным БИК уже существует',
  name: 'Заполните поле Наименование',
  address: 'Заполните поле Адрес',
  account: 'Заполните поле Кор.Счёт',
};

/**
 * Абстрактный класс, который содержит в себе логику для работы с данными банка
 */
export abstract class BankLogic<
  P extends BankLogicProps = BankLogicProps,
  S extends BankLogicState = BankLogicState
> extends React.Component<P, S> {
  protected abstract _pushData(): void;
  protected abstract _checkBik(): boolean;

  protected abstract _buttonTitle: string;

  protected _onNameChange = (e): void => {
    if (e.target.value.length < 20) {
      this.setState({
        name: e.target.value,
      });
    }
  };

  protected _onBikChange = (e): void => {
    if (this._validateNumField(e.target.value, 9)) {
      this.setState({
        bik: e.target.value,
      });
    }
  };

  protected _onAccounthange = (e): void => {
    if (this._validateNumField(e.target.value, 15)) {
      this.setState({
        account: e.target.value,
      });
    }
  };

  protected _onAddressChange = (e): void => {
    if (e.target.value.length < 30) {
      this.setState({
        address: e.target.value,
      });
    }
  };

  /**
   * Проверяет значение на число с заданной длиной
   * @param value Значение
   * @param length Максимальная длина значения
   */
  private _validateNumField(value: string, length: number): boolean {
    if (value.length <= length && (value.match(/^\d+$/) || value.length === 0)) return true;
    return false;
  }

  /**
   * Проверяем все поля для заполнения на валидность
   */
  protected _validateFields = (): boolean => {
    let errorFields: string[] = [];

    // проверяем каждое поле на пустое значение, а также бик на то, что он должен состоять из 9 цифр
    if (this.state.bik.length === 0) errorFields.push('bik');
    if (!errorFields.includes('bik') && this.state.bik.length !== 9) errorFields.push('bikValid');
    if (this.state.account.length === 0) errorFields.push('account');
    if (this.state.address.length === 0) errorFields.push('address');
    if (this.state.name.length === 0) errorFields.push('name');
    if (!errorFields.includes('bik') && !this._checkBik()) errorFields.push('notAvaliable');
    if (errorFields.length === 0) return true;

    this.setState({
      errorFields,
    });

    return false;
  };

  protected _renderFields() {
    return (
      <form className="bank-logic-form" noValidate onSubmit={this._onSubmit}>
        <div className="blf_fields-wrapper">
          <FieldInput onChange={this._onBikChange} type="tel" value={this.state.bik} title="БИК" required />
        </div>
        <div className="blf_fields-wrapper">
          <FieldInput
            onChange={this._onNameChange}
            type="text"
            value={this.state.name}
            title="Наименование"
            required
          />
        </div>
        <div className="blf_fields-wrapper">
          <FieldInput onChange={this._onAddressChange} type="text" value={this.state.address} title="Адрес" required />
        </div>
        <div className="blf_fields-wrapper">
          <FieldInput
            onChange={this._onAccounthange}
            type="tel"
            value={this.state.account}
            title="Кор.Счёт"
            required
          />
        </div>
        <div className="blf_errors">{this._renderErrors()}</div>
        <Button type={ButtonType.submit}>{this._buttonTitle}</Button>
      </form>
    );
  }

  protected _renderErrors() {
    if (this.state.errorFields.length === 0) return null;
    return this.state.errorFields.map((errorFieldName: string) => (
      <Error key={errorFieldName} title={errors[errorFieldName]} extraClass="blf_field-error" />
    ));
  }

  protected _renderError(title: string) {
    return <Error title={title} extraClass="blf_field-error" />;
  }

  protected _onSubmit = (e): void => {
    e.preventDefault();

    if (this._validateFields()) {
      this._pushData();
    }
  };

  protected _buildBankFromState = (id?: number): bank => {
    const banksLength: number = this.props.banks.length + 1;
    return {
      bik: Number(this.state.bik),
      account: Number(this.state.account),
      name: this.state.name,
      address: this.state.address,
      id: id ? id : banksLength,
    };
  };
}
