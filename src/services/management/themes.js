import { useEffect, useState, useCallback } from "react";
import { useAuth } from "services/authentication/Authentication";
import { HttpError } from "utils/http";

export function useThemes(page, pageSize = 10) {
  const { getTokenSilently } = useAuth();

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [themes, setThemes] = useState([]);
  const [error, setError] = useState();

  const refresh = useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        const token = await getTokenSilently();
        const search = new URLSearchParams({
          skip: (page - 1) * pageSize,
          limit: pageSize,
        });
        const response = await fetch(
          "/api/management/theme?" + search.toString(),
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "LoadThemesFailed",
            await response.json()
          );
        }
        setThemes(await response.json());
        const count = parseInt(response.headers.get("X-Count"));
        setCount(count);
        const pageCount = Math.ceil(count / pageSize);
        setPageCount(pageCount);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, pageSize, setLoading, setThemes, setCount, setPageCount, setError]);

  const create = useCallback(
    ({ name }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = await getTokenSilently();
          const response = await fetch(`/api/management/theme`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              name,
            }),
          });
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "CreateThemeFailed",
              await response.json()
            );
          }
          resolve(await response.json());
        } catch (err) {
          reject(err);
        }
      });
    },
    [getTokenSilently]
  );

  const remove = useCallback(
    (id) => {
      const promise = new Promise(async (resolve, reject) => {
        try {
          setLoading(true);
          const token = await getTokenSilently();
          const response = await fetch(`/api/management/theme/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "RemoveThemeFailed",
              await response.json()
            );
          }
          refresh();
          resolve(true);
        } catch (err) {
          setError(err);
          reject(err);
        } finally {
          setLoading(false);
        }
      });
      return promise;
    },
    [setLoading, setError, getTokenSilently]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading,
    themes,
    count,
    pageCount,
    create,
    remove,
    refresh,
    error,
  };
}

export function useTheme(id) {
  const { getTokenSilently } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [theme, setTheme] = useState();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await getTokenSilently();
        const response = await fetch(`/api/management/theme/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "LoadThemeFailed",
            await response.json()
          );
        }
        setTheme(await response.json());
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, setLoading, setTheme, setError, getTokenSilently]);

  const save = useCallback(
    (theme) => {
      (async () => {
        try {
          setLoading(true);
          const token = await getTokenSilently();
          const response = await fetch(`/api/management/theme/${id}`, {
            method: "PUT",
            body: JSON.stringify(theme),
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "SaveThemeFailed",
              await response.json()
            );
          }
          setTheme(await response.json());
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    },
    [id, setLoading, setTheme, setError, getTokenSilently]
  );

  const remove = useCallback(() => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const token = await getTokenSilently();
        const response = await fetch(`/api/management/theme/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "RemoveImageFailed",
            await response.json()
          );
        }
        setTheme();
        resolve(true);
      } catch (err) {
        setError(err);
        reject(err);
      } finally {
        setLoading(false);
      }
    });
    return promise;
  }, [id, setLoading, setTheme, setError, getTokenSilently]);

  return {
    loading,
    theme,
    save,
    remove,
    error,
  };
}
