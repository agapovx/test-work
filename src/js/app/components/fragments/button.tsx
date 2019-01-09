import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  extraClass?: string;
  onClick?: (any?) => void;
  disabled?: boolean;
}

export enum ButtonType {
  submit = 'submit',
  button = 'button',
}

/**
 * Кастомная кнопка с возможностью кастомизации через пропсы.
 */
export default class Button extends React.PureComponent<ButtonProps> {
  render() {
    const { extraClass = '', disabled, children } = this.props;

    const defProps = {
      className: this._getClassName(extraClass),
      onClick: this._onClick,
      disabled,
      children,
    };

    return <button {...defProps} />;
  }

  private _onClick = () => {
    this.props.onClick && this.props.onClick();
  };

  private _getClassName = (extraClass: string) => {
    return `custom-button ${extraClass}`;
  };
}
