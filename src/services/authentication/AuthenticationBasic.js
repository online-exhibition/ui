import React, { useCallback, useState } from "react";

import { HttpError, encodeBasic } from "utils/http";
import { digestMessage } from "utils/crypto";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from "utils/storage";

import { AuthenticationContext } from "./AuthenticationContext";

// eslint-disable-next-line react/prop-types
export function AuthenticationBasic({ children }) {
  const [authorization, setAuthorization] = useState(
    getSessionItem("authorization")
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!authorization);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(getSessionItem("user"));

  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      return new Promise(async (resolve, reject) => {
        try {
          const authorizationHeader = encodeBasic(
            username,
            await digestMessage(password)
          );
          const response = await fetch("/api/user/login", {
            headers: {
              Authorization: authorizationHeader,
            },
          });
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "LoginFailed",
              await response.json()
            );
          }
          const user = await response.json();
          setSessionItem("authorization", authorizationHeader);
          setSessionItem("user", user);
          setAuthorization(authorizationHeader);
          setUser(user);
          setIsAuthenticated(true);
          resolve(user);
        } catch (err) {
          console.error(err);
          reject(err);
        } finally {
          setLoading(false);
        }
      });
    },
    [setLoading, setAuthorization, setIsAuthenticated, setUser]
  );

  const logout = useCallback(() => {
    setAuthorization(null);
    setIsAuthenticated(false);
    setUser(null);
    removeSessionItem("authorization");
    removeSessionItem("user");
  }, []);

  const getTokenSilently = useCallback(() => {
    if (!authorization) {
      throw new HttpError(401, "Unauthorized", "The user is not authorized.");
    }
    return Promise.resolve(authorization);
  }, [authorization]);

  return (
    <AuthenticationContext.Provider
      value={{
        loading,
        isAuthenticated,
        user,
        getTokenSilently,
        login,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
