import { useCallback } from "react";
import { HttpError } from "utils/http";

export function useUsers() {
  const create = useCallback((userRequest) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userRequest),
        });
        if (response.status > 399) {
          throw new HttpError(
            response.status,
            "ErrorCreateingUser",
            "Couldn't create user."
          );
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }, []);
  return {
    create,
  };
}
