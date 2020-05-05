import { useEffect, useState, useCallback } from "react";
import { useAuth } from "services/authentication/Authentication";
import { HttpError } from "utils/http";

export function useImages(page, pageSize = 10) {
  const { getTokenSilently } = useAuth();

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [images, setImages] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = await getTokenSilently();
        const search = new URLSearchParams({
          skip: (page - 1) * pageSize,
          limit: pageSize,
        });
        const response = await fetch(
          "/api/management/image?" + search.toString(),
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "LoginFailed",
            await response.json()
          );
        }
        setImages(await response.json());
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
  }, [page, pageSize, setLoading, setImages, setCount, setPageCount, setError]);

  return {
    loading,
    images,
    count,
    pageCount,
    error,
  };
}

export function useImage(id) {
  const { getTokenSilently } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await getTokenSilently();
        const response = await fetch(`/api/management/image/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "LoadImageFailed",
            await response.json()
          );
        }
        setImage(await response.json());
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, setLoading, setImage, setError, getTokenSilently]);

  const save = useCallback(
    (image) => {
      (async () => {
        try {
          setLoading(true);
          const token = await getTokenSilently();
          const response = await fetch(`/api/management/image/${id}`, {
            method: "PUT",
            body: JSON.stringify(image),
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          if (response.status > 399) {
            throw new HttpError(
              response.status,
              "SaveImageFailed",
              await response.json()
            );
          }
          setImage(await response.json());
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    },
    [id, setLoading, setImage, setError, getTokenSilently]
  );

  const remove = useCallback(() => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const token = await getTokenSilently();
        const response = await fetch(`/api/management/image/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "SaveImageFailed",
            await response.json()
          );
        }
        setImage();
        resolve(true);
      } catch (err) {
        setError(err);
        reject(err);
      } finally {
        setLoading(false);
      }
    });
    return promise;
  }, [id, setLoading, setImage, setError, getTokenSilently]);

  return {
    loading,
    image,
    save,
    remove,
    error,
  };
}
