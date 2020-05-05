import React, { useCallback, useState } from "react";

import { HttpError, encodeBasic } from "utils/http";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from "utils/storage";

import { AuthenticationContext } from "./AuthenticationContext";

// eslint-disable-next-line react/prop-types
export function AuthenticationBasic({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authorization, setAuthorization] = useState(
    getSessionItem("authorization")
  );
  const [user, setUser] = useState(null);

  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      try {
        const authorizationHeader = encodeBasic(username, password);
        const response = await fetch("/api/user/login", {
          headers: {
            Authentication: authorizationHeader,
          },
        });
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "LoginFailed",
            await response.json()
          );
        }
        setSessionItem("authorization", authorizationHeader);
        setAuthorization(authorizationHeader);
        setIsAuthenticated(true);
        setUser(await response.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setAuthorization, setIsAuthenticated, setUser]
  );

  const logout = useCallback(() => {
    setAuthorization(null);
    setIsAuthenticated(false);
    setUser(null);
    removeSessionItem("authorization");
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
