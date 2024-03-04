import { delay } from "./delay";

export async function fetchDataWithRetry(url:string, body?:any, method?:string, headers?:any) {

  const fetchOptions = {
    method:method,
    body,
    headers:{
      'Authorization': `Bearer `+ (localStorage.getItem("authAccess") || " "),
      ...headers
    }
  };

  const fetchData = async (): Promise<any> => {
    try {
      const response = await fetch(url, fetchOptions);
      if (response.ok) {
        return response.json();

      } else if (response.status === 401) {

        await refreshJWTToken();

        return fetchDataWithRetry(url);
      } else {
        const response2 = await fetch(url, fetchOptions);

        if (response2.ok) {
          return response2.json();
        } else {
          throw new Error(`Failed to fetch: ${response2.status}`);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  return fetchData();
}

async function refreshJWTToken() {
  const response = await fetch(window.location.origin+'/api/auth/v1.0/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ (localStorage.getItem('authRefresh') || " ") 
    },
    
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("authAccess", data.accessToken); 
  } else {

    if(
      window.location.href !== window.location.origin+'/' 
      && window.location.href !== window.location.origin + "/auth" 
      && window.location.href !== window.location.origin + "/menu"
      && !window.location.href.match(/\/product\/\d+/)
      && window.location.href !== window.location.origin + "/basket"
     )
     {
      window.location.href = '/';
    };
    throw new Error(`Failed to refresh token: ${response.status}`);
  }
}
