import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { FormContext } from './Form';

const emailPattern =
  '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';

function Input({
  name,
  required,
  readonly,
  email,
  pattern,
  value,
  children,
  onChange,
  Component = TextField,
  ...props
}) {
  const [inputRef] = useState(React.createRef());
  useEffect(() => {
    if (value && inputRef && inputRef.current) {
      const element = inputRef.current;
      const prototype = Object.getPrototypeOf(element);
      const prototypeValueSetter = Object.getOwnPropertyDescriptor(
        prototype,
        'value'
      ).set;
      prototypeValueSetter.call(element, value);
      const e = new Event('input', { bubbles: true });
      element.dispatchEvent(e);
    }
  }, [value, inputRef, inputRef.current]);
  return (
    <FormContext.Consumer>
      {(form) => {
        if (!form) {
          throw new Error('No FormContext available.');
        }
        const { data, change, error, register } = form;
        register({
          name,
          required,
          validation: { regex: email ? emailPattern : pattern },
        });
        return (
          <Component
            {...props}
            required={!readonly && required}
            disabled={readonly}
            name={name}
            error={error[name]}
            value={data[name] || ''}
            onChange={change}
            inputProps={{ ref: inputRef }}
          >
            {children}
          </Component>
        );
      }}
    </FormContext.Consumer>
  );
}
Input.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.bool,
  pattern: PropTypes.string,
  onChange: PropTypes.func,
  onValid: PropTypes.func,
  ...TextField.PropTypes,
};

export default Input;
