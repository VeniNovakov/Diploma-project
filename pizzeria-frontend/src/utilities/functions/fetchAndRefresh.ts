export async function fetchDataWithRetry(url:string, body?:any, method?:string, headers?:any) {

  const fetchOptions = {
    method:method,
    body,
    headers:{
      'Authorization': `Bearer `+localStorage.getItem("authAccess"),
      ...headers
    }
  };

  const fetchData = async (): Promise<any> => {
    try {
      const response = await fetch(url, fetchOptions);

      if (response.ok) {
        return response.json();

      } else if (response.status === 401) {
        // If unauthorized, refresh JWT token and retry fetching
        await refreshJWTToken();
        // Retry fetching with the new token
        return fetchDataWithRetry(url);
      } else {
        // Retry fetching once in case of other failures
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

  // Initial call to fetch data
  return fetchData();
}

// Example function to refresh JWT token
async function refreshJWTToken() {
  // Replace this with your logic to refresh the JWT token
  const response = await fetch(window.location.origin+'/api/auth/v1.0/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ localStorage.getItem('authRefresh') 
    },
    
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("authAccess", data.accessToken); 
  } else {
    window.location.href = window.location.origin
    throw new Error(`Failed to refresh token: ${response.status}`);
  }
}
