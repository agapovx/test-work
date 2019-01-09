import * as React from 'react';

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  extraClass?: string;
  placeholder?: string;
}

/**
 * Компонент, содержащий в себе label и input
 */
export class FieldInput extends React.Component<FieldInputProps> {
  shouldComponentUpdate(nextProps: FieldInputProps) {
    if (this.props.value !== nextProps.value) return true;
    return false;
  }

  render() {
    const { extraClass = '' } = this.props;
    return (
      <div className={`field-input-wrapper ${extraClass}`}>
        <label className="fiw_label">
          <span className="fiw_title">{this.props.title}</span>
          <input
            onChange={this.props.onChange}
            value={this.props.value}
            className="fiw_input"
            type={this.props.type}
            placeholder={this.props.placeholder}
            {...this.props}
          />
        </label>
      </div>
    );
  }
}
