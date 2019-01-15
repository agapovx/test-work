import * as React from 'react';
import { FieldInput } from '../fragments/field-input';
import { validateNumField, renderErrors } from './bank-logic';
import Button, { ButtonType } from '../fragments/button';
import Preloader from '../fragments/preloader';
import { bank } from '../../reducers/banks';

interface AddBankByBikProps {
  checkBik: (bik: string) => boolean;
  addBank: (bank: bank) => void;
  setSuccess: () => void;
  banksLength: number;
}

interface AddBankByBikState {
  bik: string;
  isLoading: boolean;
  errorFields: string[];
}

/**
 * Интересующие нас поля, которые приходят через api
 */
interface bankDataFromApi {
  error?: string;
  address?: string;
  namemini?: string;
  index?: string;
}

/**
 * Все типы ошибок с сообщениями
 */
const errors = {
  bik: 'Заполните поле БИК',
  bikValid: 'БИК должен состоять из 9 символов',
  notAvaliable: 'Банк с данным БИК уже существует',
  notFound: 'Данные банка по указанному БИК не найдены',
  oops: 'Что-то пошло не так)',
};

export class AddBankByBik extends React.Component<AddBankByBikProps, AddBankByBikState> {
  constructor(props: AddBankByBikProps) {
    super(props);

    this.state = {
      bik: '',
      isLoading: false,
      errorFields: [],
    };
  }

  render() {
    return (
      <div className="add-bank-by-bik">{this.state.isLoading ? this._renderPreloader() : this._renderFields()}</div>
    );
  }

  protected _renderErrors = () => {
    return renderErrors(this.state.errorFields, errors, 'abbb_error-field');
  };

  protected _renderFields = () => {
    return (
      <form className="abbb_form" onSubmit={this._onSubmit}>
        <div className="abbb_fields">
          <FieldInput onChange={this._onBikChange} type="tel" value={this.state.bik} title="БИК" />
        </div>
        {this._renderErrors()}
        <Button extraClass="abbb_submit-button" type={ButtonType.submit}>
          Добавить
        </Button>
      </form>
    );
  };

  protected _renderPreloader = () => {
    return <Preloader />;
  };

  private _onSubmit = e => {
    e.preventDefault();
    if (this._validateFields()) {
      this._pushData();
    }
  };

  private _validateFields = (): boolean => {
    let errorFields: string[] = [];

    if (this.state.bik.length === 0) errorFields.push('bik');
    if (!errorFields.includes('bik') && this.state.bik.length !== 9) errorFields.push('bikValid');
    if (!this.props.checkBik(this.state.bik)) errorFields.push('notAvaliable');
    if (errorFields.length === 0) return true;

    this.setState({
      errorFields,
    });

    return false;
  };

  private _onBikChange = e => {
    if (validateNumField(e.target.value, 9)) {
      this.setState({
        bik: e.target.value,
      });
    }
  };

  private _pushData = async () => {
    const bank: bank | null = await this._getBank();
    if (bank) {
      this._resetFields();
      this.props.addBank(bank);
      this.props.setSuccess();
    }
  };

  private _resetFields = () => {
    this.setState({
      bik: '',
      errorFields: [],
    });
  };

  /**
   * Получаем данные о банке по БИК
   * Если были получены некорректные данные, выводим ошибку, иначе отправляем данные в стор
   */
  private _getBank = async () => {
    const data: bankDataFromApi = await this._loadBankInfo();
    this._disableLoading();

    if (!data) {
      this.setState({ errorFields: ['oops'] });
    }
    if (data.error) {
      this.setState({ errorFields: ['notFound'] });
      return null;
    }
    // адрес может отсутствовать, поэтому в случае отсутствия ставим затычку
    const bank: bank = {
      bik: this.state.bik,
      name: data.namemini!,
      account: data.index!,
      address: data.address ? data.address : 'Нет адреса',
      id: this.props.banksLength,
    };

    return bank;
  };

  private _loadBankInfo = async () => {
    const { bik } = this.state;
    this._enableLoading();
    try {
      const response = await fetch(`http://www.bik-info.ru/api.html?type=json&bik=${bik}`);
      const data = await response.json();
      return data;
    } catch (error) {
      this._disableLoading();
      throw new Error('Не удалось загрузить данные');
    }
  };

  private _enableLoading = () => {
    this.setState({ isLoading: true });
  };

  private _disableLoading = () => {
    this.setState({ isLoading: false });
  };
}
