import React, { useCallback, useState, useEffect } from "react";
import * as uuid from "uuid";

export const FormContext = React.createContext();

const forms = {};

function getForm(id) {
  if (!forms[id]) {
    forms[id] = [];
  }
  return forms[id];
}

function getField(id, name) {
  const form = getForm(id);
  return form.find((field) => field.name === name);
}

function putField(id, name, fieldDescriptor) {
  const field = getField(id, name);
  if (!field) {
    const form = getForm(id);
    form.push(fieldDescriptor);
  }
}

function Form({ children, input, validation, onSubmit, ...props }) {
  const [id] = useState(props.id || uuid.v4());
  const [data, setData] = useState(input || {});
  const [valid, setValid] = useState({});
  const [error, setError] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    return () => {
      delete forms[id];
    };
  }, [id]);

  const register = useCallback(
    (fieldDescriptor) => {
      if (fieldDescriptor.submit) {
        return;
      }
      const { name } = fieldDescriptor;
      putField(id, name, fieldDescriptor);
    },
    [id]
  );

  const change = useCallback(
    ({ target }) => {
      const { name, value } = target;
      const newData = { ...data, [name]: value };
      setData(newData);
      const field = getField(id, name);
      if (
        field &&
        field.validation &&
        (field.validation.regex || (!field.validation.regex && field.required))
      ) {
        let isValid = true;
        if (field.validation.regex) {
          const expectation = new RegExp(field.validation.regex);
          const match = expectation.exec(value);
          isValid = match && match[0] === value;
        }
        setError({ ...error, [name]: !isValid });
        setValid({ ...valid, [name]: isValid });
      }
    },
    [id, data, setData, valid, setValid, error, setError]
  );

  useEffect(() => {
    if (data !== input && input != null) {
      const keys = Object.keys(input);
      for (let i = 0, n = keys.length; i < n; i++) {
        const name = keys[i];
        if (!data[name]) {
          change({ target: { name, value: input[name] } });
          break;
        }
      }
    }
  }, [input, data, change]);

  const submit = useCallback(
    (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      onSubmit && onSubmit(data);
    },
    [onSubmit, data]
  );

  useEffect(() => {
    const form = getForm(id);
    const excpectedCount = form.reduce(
      (count, field) => (field.required ? count + 1 : count),
      0
    );
    const validCount = form.reduce(
      (count, field) =>
        field.required && valid[field.name] ? count + 1 : count,
      0
    );
    let formIsValid = validCount === excpectedCount;
    if (validation) {
      formIsValid = validation(data, formIsValid);
    }
    setFormIsValid(formIsValid);
  }, [id, data, valid, validation, setFormIsValid]);

  return (
    <FormContext.Provider
      value={{ data, error, formIsValid, register, change }}
    >
      <form {...props} id={id} onSubmit={submit}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export default Form;
