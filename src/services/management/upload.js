import { getSessionItem } from "utils/storage";
import { HttpError } from "utils/http";
import { useCallback, useState } from "react";
import { useAuth } from "services/authentication/Authentication";

export function useUpload() {
  const { getTokenSilently } = useAuth();
  const [progress, setProgress] = useState(0);
  const upload = useCallback(
    (uri, data, opts) => {
      setProgress(0);
      const options = opts || {};
      return new Promise(async (resolve, reject) => {
        let authorizationHeaders;
        const authorization = getSessionItem("authorization");
        if (authorization) {
          authorizationHeaders = { Authorization: await getTokenSilently() };
        }
        const requestHeaders = Object.assign(
          authorizationHeaders,
          options.headers
        );
        const oReq = new XMLHttpRequest();
        oReq.open("POST", uri, true);
        oReq.onload = function (oEvent) {
          if (oReq.status === 200) {
            resolve({
              xhr: oReq,
              status: oReq.status,
              body: oReq.response,
              json: () => JSON.parse(oReq.responseText),
            });
          } else {
            if (oReq.status > 299) {
              reject(
                new HttpError(oReq.status, "Request failed", {
                  xhr: oReq,
                  status: oReq.status,
                  body: oReq.response,
                  json: () => JSON.parse(oReq.responseText),
                })
              );
            }
          }
        };
        oReq.upload.onprogress = (event) => {
          setProgress((event.loaded / event.total) * 100);
        };
        Object.keys(requestHeaders).forEach((header) => {
          oReq.setRequestHeader(header, requestHeaders[header]);
        });
        const { name, file } = data;
        const formData = new FormData();
        formData.append(name, file);
        oReq.send(formData);
      });
    },
    [setProgress]
  );
  return { progress, upload };
}
