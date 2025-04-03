import ky from "ky";

import { CookieStorage } from "@/store/storage";

export const api = ky.create({
  prefixUrl: "https://driver-api.truck-king.co", // todo: get env base URL
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookieString = CookieStorage.toString();
        if (cookieString) request.headers.set("Cookie", cookieString);
        console.log("beforeRequest", request.headers);
      },
    ],
    afterResponse: [
      // AT 만료될 때 RT도 서버 자동 갱신 -> 매 응답마다 쿠키 최신화
      async (req, opts, response) => {
        if (response.ok) {
          const combinedCookiesHeader = response.headers.get("set-cookie");
          if (combinedCookiesHeader)
            CookieStorage.parseAndSet(combinedCookiesHeader);
          console.log("current cookies", CookieStorage.getAll());

          return;
        }

        console.error("error:", { req, opts, response });
        switch (response.status) {
          case 401:
            CookieStorage.clearAll();
            throw new Error("Unauthorized access. Please login again.");
          case 403:
            throw new Error("Forbidden");
          case 404:
            throw new Error("Not Found");
          case 500:
            throw new Error("Internal Server Error");
          default:
            break;
        }
      },
    ],
  },
});
