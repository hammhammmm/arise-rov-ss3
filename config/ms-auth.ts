
export const msalConfig = {
  auth: {
    clientId: "ed63b8f9-f447-47ec-a81d-8026f226a301",
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
