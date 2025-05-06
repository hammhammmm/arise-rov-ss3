
export const msalConfig = {
  auth: {
    clientId: "af14ee6d-e8e6-4596-8161-8b01885e2c69",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "/auth",
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};


