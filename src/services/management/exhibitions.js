import { useState, useCallback, useEffect } from "react";

import { useAuth } from "services/authentication/Authentication";
import { HttpError } from "utils/http";

export function useExhibitions(page, pageSize = 10, activeOnly) {
  const { getTokenSilently, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [exhibitions, setExhibitions] = useState([]);
  const [error, setError] = useState();

  const refresh = useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        const search = new URLSearchParams({
          skip: (page - 1) * pageSize,
          limit: pageSize,
        });
        let response;
        if (activeOnly || !isAuthenticated) {
          response = await fetch("/api/exhibition?" + search.toString());
        } else {
          const token = await getTokenSilently();
          response = await fetch(
            "/api/management/exhibition?" + search.toString(),
            {
              headers: {
                Authorization: token,
              },
            }
          );
        }
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "LoginFailed",
            await response.json()
          );
        }
        const exhibitions = await response.json();
        console.log("Fetched", exhibitions);
        setExhibitions(exhibitions);
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
  }, [
    page,
    pageSize,
    setLoading,
    setExhibitions,
    setCount,
    setPageCount,
    setError,
  ]);

  useEffect(() => {
    refresh();
  }, []);

  const createNew = useCallback(
    ({ title, description, maxCount, expire, theme }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = await getTokenSilently();
          const response = await fetch(`/api/management/exhibition`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              title,
              description,
              maxCount,
              expire,
              theme,
            }),
          });
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "RemoveExhibitionFailed",
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

  const update = useCallback(
    (exhibition) => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = await getTokenSilently();
          const response = await fetch(
            `/api/management/exhibition/${exhibition.id}`,
            {
              method: "PUT",
              body: JSON.stringify(exhibition),
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "SaveExhibitionFailed",
              await response.json()
            );
          }
          resolve(await response.json());
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });
    },
    [getTokenSilently]
  );

  const remove = useCallback(
    (removeId) => {
      const promise = new Promise(async (resolve, reject) => {
        try {
          setLoading(true);
          const token = await getTokenSilently();
          const response = await fetch(
            `/api/management/exhibition/${removeId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "RemoveExhibitionFailed",
              await response.json()
            );
          }
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

  return {
    loading,
    exhibitions,
    count,
    pageCount,
    createNew,
    update,
    remove,
    refresh,
    error,
  };
}

export function useExhibition(id) {
  const { isAuthenticated, getTokenSilently } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [exhibition, setExhibition] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      try {
        setLoading(true);
        let response;

        if (isAuthenticated) {
          const token = await getTokenSilently();
          response = await fetch(`/api/management/exhibition/${id}`, {
            headers: {
              Authorization: token,
            },
          });
        } else {
          response = await fetch(`/api/exhibition/${id}`);
        }
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "LoadExhibitionFailed",
            await response.json()
          );
        }
        setExhibition(await response.json());
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, setLoading, setExhibition, setError, getTokenSilently]);

  const save = useCallback(
    (exhibition) => {
      if (!id) {
        return;
      }
      (async () => {
        try {
          setLoading(true);
          const token = await getTokenSilently();
          const response = await fetch(`/api/management/exhibition/${id}`, {
            method: "PUT",
            body: JSON.stringify(exhibition),
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "SaveExhibitionFailed",
              await response.json()
            );
          }
          setExhibition(await response.json());
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    },
    [id, setLoading, setExhibition, setError, getTokenSilently]
  );

  const remove = useCallback(() => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const token = await getTokenSilently();
        const response = await fetch(`/api/management/exhibition/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "RemoveExhibitionFailed",
            await response.json()
          );
        }
        setExhibition();
        resolve(true);
      } catch (err) {
        setError(err);
        reject(err);
      } finally {
        setLoading(false);
      }
    });
    return promise;
  }, [id, setLoading, setExhibition, setError, getTokenSilently]);

  return {
    loading,
    exhibition,
    save,
    remove,
    error,
  };
}
