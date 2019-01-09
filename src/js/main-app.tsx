import { createHashHistory } from "history";
import * as React from "react";
import { Provider } from "react-redux";
import { Route, Router } from "react-router-dom";
import { createStore } from "redux";

import AddBankForm from "./app/components/banks/add-bank-form";
import BanksList from "./app/components/banks/banks-list";
import { AppNavigation } from "./app/components/navigation/app-navigation";
import reducers from "./app/reducers/reducers";

export const store = createStore(reducers);

export const MainApp = () => {
  return (
    <main className="main-app">
      <Provider store={store}>
        <Router history={createHashHistory()}>
          <div className="ma_wrapper">
            <header className="ma_header">
              <nav className="ma_navigation">
                <AppNavigation />
              </nav>
            </header>
            <div className="ma_routes">
              <Route exact path="" component={AddBankForm} />
              <Route path="/banks-list" component={BanksList} />
            </div>
          </div>
        </Router>
      </Provider>
    </main>
  );
};
