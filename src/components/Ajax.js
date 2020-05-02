import React, {useContext, useState, useCallback} from 'react';
import {setSessionItem, getSessionItem, removeSessionItem} from 'utils/storage';
import {HttpError} from 'utils/http';

const AjaxContext = React.createContext();
export const useAjax = () => useContext(AjaxContext);

const exposedMethods = ['get', 'post', 'head', 'put'];

function createExposed({headers = {}}) {
  const expose = { };
  exposedMethods.forEach((methodName) => {
    expose[methodName] = (uri, data, requestConfig) => {
      const options =
        methodName !== 'post' && methodName !== 'put' && data ?
          data :
          requestConfig || {};
      let authorizationHeaders;
      const authorization = getSessionItem('authorization');
      if (authorization) {
        authorizationHeaders = {'Authorization': authorization};
      }
      return fetch(uri, {
        ...options,
        method: methodName.toUpperCase(),
        headers: Object.assign(
            {
              'Content-Type': 'application/json',
            },
            headers,
            authorizationHeaders,
            options.headers,
        ),
        body:
          methodName === 'post' || methodName === 'put' ?
            JSON.stringify(data) :
            undefined,
      })
          .then((response) => {
            if (response.status > 299) {
              throw new HttpError(
                  response.status,
                  'Request failed',
                  response,
              );
            }
            return response.json();
          });
    };
  });
  return expose;
}

// eslint-disable-next-line react/prop-types
export function Ajax({children, ...props}) {
  const [expose] = useState(createExposed(props));
  const [loggedIn, setLoggedIn] = useState(
      getSessionItem('authorization') != null);
  const [user, setUser] = useState(getSessionItem('user', {}));
  const installAuthorization = useCallback((token, user) => {
    setSessionItem('authorization', token);
    setSessionItem('user', user);
    setLoggedIn(true);
    setUser(user);
  }, [setLoggedIn, setUser]);
  const removeAuthorization = useCallback(() => {
    removeSessionItem('authorization');
    removeSessionItem('user');
    setLoggedIn(false);
    setUser({});
  }, [setLoggedIn, setUser]);
  const hasAuthorization = useCallback(() => loggedIn, [loggedIn]);

  return (
    <AjaxContext.Provider value={{...expose,
      loggedIn,
      user,
      hasAuthorization,
      installAuthorization,
      removeAuthorization}}>
      {children}
    </AjaxContext.Provider>
  );
}
