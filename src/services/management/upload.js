import { getSessionItem } from "utils/storage";
import { HttpError } from "utils/http";

export function createUpload(headers) {
  return function upload(uri, data, opts) {
    const options = opts || {};
    return new Promise((resolve, reject) => {
      let authorizationHeaders;
      const authorization = getSessionItem("authorization");
      if (authorization) {
        authorizationHeaders = { Authorization: authorization };
      }
      const requestHeaders = Object.assign(
        headers,
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
      oReq.upload.onprogress = options.onProgress;
      Object.keys(requestHeaders).forEach((header) => {
        oReq.setRequestHeader(header, requestHeaders[header]);
      });
      const { name, file } = data;
      const formData = new FormData();
      formData.append(name, file);
      oReq.send(formData);
    });
  };
}
