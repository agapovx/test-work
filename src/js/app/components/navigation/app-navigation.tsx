import * as React from 'react';
import { Link } from 'react-router-dom';

export const AppNavigation = () => {
  return (
    <div className="app-navigation">
      <span className="an_link">
        <Link to="/">Добавить банк</Link>
      </span>
      <span className="an_link">
        <Link to="/banks-list">Список банков</Link>
      </span>
    </div>
  );
};
