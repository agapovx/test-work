import { findIndex } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { bank, DELETE_BANK, EDIT_BANK } from '../../reducers/banks';
import { storeState } from '../../reducers/reducers';
import Button from '../fragments/button';
import { BankLogic, BankLogicProps, BankLogicState } from './bank-logic';

interface BankItemProps extends BankLogicProps {
  bank: bank;
  banks: bank[];
  editBank: (bank: bank) => void;
  deleteBank: (bank: bank) => void;
}

interface BankItemState extends BankLogicState {
  isEdit: boolean;
  id: number;
}

/**
 * Компонент для отрисовки объекта банка с возможностью редактирования данных и удаления банка из стора
 */
export class BankItem extends BankLogic<BankItemProps, BankItemState> {
  constructor(props: BankItemProps) {
    super(props);

    this.state = {
      isEdit: false,
      name: this.props.bank.name,
      address: this.props.bank.address,
      account: this.props.bank.account.toString(),
      bik: this.props.bank.bik.toString(),
      id: this.props.bank.id,
      errorFields: [],
    };
  }

  _buttonTitle = 'Сохранить';

  render() {
    return (
      <div className="bank-item">
        {this._renderContent()}
        <div className="bi_toggle-mode">
          <Button extraClass="bi_edit-button" onClick={this._toggleEditMode}>
            Редактировать
          </Button>
          <Button extraClass="bi_delete-button" onClick={this._deleteBank}>
            Удалить
          </Button>
        </div>
      </div>
    );
  }

  protected _renderContent() {
    if (this.state.isEdit) return this._renderFields();
    return this._renderBankInfo();
  }

  protected _renderBankInfo() {
    return (
      <div className="bi_info-wrapper">
        <div className="bi_info-block">
          <span className="bi_info-title">Бик</span>
          <span className="bi_info-balue">{this.props.bank.bik}</span>
        </div>

        <div className="bi_info-block">
          <span className="bi_info-title">Наименование</span>
          <span className="bi_info-balue">{this.props.bank.name}</span>
        </div>

        <div className="bi_info-block">
          <span className="bi_info-title">Адрес</span>
          <span className="bi_info-balue">{this.props.bank.address}</span>
        </div>

        <div className="bi_info-block">
          <span className="bi_info-title">Кор.Счёт</span>
          <span className="bi_info-balue">{this.props.bank.account}</span>
        </div>
      </div>
    );
  }

  /**
   * Проверяем бик банка на доступность
   */
  protected _checkBik = (): boolean => {
    const stateBikValue: number = Number(this.state.bik);

    return findIndex(this.props.banks, (bank: bank) => bank.bik === stateBikValue && bank.id !== this.state.id) !== -1
      ? false
      : true;
  };

  /**
   * Выключаем режим редактирования, собираем объект банка, отправляем данные в стор
   */
  protected _pushData(): void {
    this._toggleEditMode();
    const bank: bank = this._buildBankFromState(this.state.id);

    this.props.editBank(bank);
  }

  private _deleteBank = (): void => {
    this.props.deleteBank(this.props.bank);
  };

  private _toggleEditMode = (): void => {
    //Если был включён режим редактирования, тогда при выключении сбрасываем поля в state до значения из props
    //Чтобы при следующем открытии режима редактирования были актуальные данные
    if (this.state.isEdit) this._resetFields();

    this.setState({
      isEdit: !this.state.isEdit,
    });
  };

  private _resetFields = (): void => {
    this.setState({
      name: this.props.bank.name,
      address: this.props.bank.address,
      account: this.props.bank.account.toString(),
      bik: this.props.bank.bik.toString(),
      errorFields: [],
    });
  };
}

const mapDispatchToProps = dispatch => {
  return {
    editBank: (bank: bank) => {
      dispatch({ type: EDIT_BANK, data: bank });
    },
    deleteBank: (bank: bank) => {
      dispatch({ type: DELETE_BANK, data: bank });
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(BankItem);
