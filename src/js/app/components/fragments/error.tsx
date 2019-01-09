import * as React from 'react';

interface ErrorProps {
  title: string;
  extraClass?: string;
}

/**
 * Компонент для отрисовки ошибки
 */
export class Error extends React.PureComponent<ErrorProps> {
  render() {
    const { title, extraClass = '' } = this.props;
    return (
      <div className={`error-message ${extraClass}`}>
        <span className="em_title">{title}</span>
      </div>
    );
  }
}
