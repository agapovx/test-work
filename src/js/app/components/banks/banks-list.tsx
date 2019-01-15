import * as React from 'react';
import { bank } from '../../reducers/banks';
import { storeState } from '../../reducers/reducers';
import { connect } from 'react-redux';
import BankItem from './bank-item';
import Button from '../fragments/button';

interface BanksListProps {
  banks: bank[];
}

interface BanksListState {
  banks: bank[];
  searchText: string;
  sortType: string;
}

export enum bankSorts {
  default = '',
  name = 'name',
  nameReverse = 'name-reverse',
  bik = 'bik',
  bikReverse = 'bik-reverse',
}

/**
 * Компонент для отрисовки списка банков. Никакой логики, просто рендерит данные.
 */
export class BanksList extends React.Component<BanksListProps, BanksListState> {
  constructor(props: BanksListProps) {
    super(props);

    this.state = {
      banks: this.props.banks,
      searchText: '',
      sortType: bankSorts.default,
    };
  }

  render() {
    return (
      <div className="banks-list">
        <h2 className="bl_title">Список банков</h2>
        {this._renderFilterSearch()}
        {this._renderContent()}
      </div>
    );
  }

  protected _renderContent() {
    if (this.props.banks.length === 0) return this._renderNotFound('Нет данных по банкам');

    const filteredBanks: bank[] = this._getFilteredBanks();
    if (filteredBanks.length === 0) return this._renderNotFound('Не удалось найти данные по данному запросу');

    return this._renderBankItems(filteredBanks);
  }

  protected _renderFilterSearch() {
    if (this.props.banks.length > 0) {
      return (
        <div className="bl_actions-wrapper">
          <div className="bl_actions">
            <input className="bl_search" type="text" onChange={this._onSearch} placeholder="Поиск" />
            <div className="bl_action-buttons">
              <Button extraClass="bl_action-button" onClick={this._nameSort}>
                Сортировка по имени
              </Button>
              <Button extraClass="bl_action-button" onClick={this._bikSort}>
                Сортировка по БИК
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  protected _renderBankItems(filteredBanks: bank[]) {
    return (
      <div className="bl_content">
        <div className="bl_bank-items">
          {filteredBanks.map((bank: bank, key: number) => {
            return (
              <div className="bl_bank-item" key={key}>
                <BankItem bank={bank} banks={this.props.banks} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  protected _renderNotFound(text: string) {
    return (
      <div className="bl_not-found">
        <span className="bl_not-found-text">{text}</span>
      </div>
    );
  }

  private _getFilteredBanks = (): bank[] => {
    const { searchText } = this.state;
    const fileredBanks = this.props.banks.filter(
      (bank: bank) =>
        bank.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
        bank.bik.toString().indexOf(searchText) !== -1
    );
    return this._getSortedBanks(fileredBanks);
  };

  private _getSortedBanks = (banks: bank[]) => {
    return banks.sort(this._filterBanks);
  };

  private _filterBanks = (a: bank, b: bank) => {
    switch (this.state.sortType) {
      case bankSorts.bik:
        return Number(a.bik) - Number(b.bik);
      case bankSorts.bikReverse:
        return Number(b.bik) - Number(a.bik);
      case bankSorts.name:
        return a.name > b.name ? 1 : -1;
      case bankSorts.nameReverse:
        return a.name > b.name ? -1 : 1;
      default:
        return a.id - b.id;
    }
  };

  private _nameSort = () => {
    this.setState({
      sortType: this.state.sortType === bankSorts.name ? bankSorts.nameReverse : bankSorts.name,
    });
  };

  private _bikSort = () => {
    this.setState({
      sortType: this.state.sortType === bankSorts.bik ? bankSorts.bikReverse : bankSorts.bik,
    });
  };

  private _onSearch = e => {
    this.setState({
      searchText: e.target.value,
    });
  };
}

const mapStateToProps = (state: storeState) => {
  return {
    banks: state.banks,
  };
};

export default connect(mapStateToProps)(BanksList);
