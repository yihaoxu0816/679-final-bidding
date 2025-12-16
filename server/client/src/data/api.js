const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6790';
const ROOMS_ENDPOINT = `${API_URL}/api/rooms`;
const USERS_ENDPOINT = `${API_URL}/api/users`;
const AUTH_ENDPOINT = `${API_URL}/api/auth`;
const BIDS_ENDPOINT = `${API_URL}/api/bids`;

const buildUrlWithQuery = (url, queryParams) => {
  const params = new URLSearchParams(queryParams);
  return `${url}?${params.toString()}`;
}

const handleGet = async (url, queryParams = null) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const response = await fetch(`${url}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`GET request to ${url} failed: ${response.statusText}`);
  }
}

const handlePost = async (url, body, queryParams = null, jwtToken = null) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add JWT token to headers if provided
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });
  
  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  } else {
    throw new Error(`POST request to ${url} failed: ${response.statusText}`);
  }
};

const handleDelete = async (url, queryParams = null, jwtToken = null) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const headers = {};
    if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  });
  
  if (response.ok) {
    return response.statusText;
  } else {
    throw new Error(`DELETE request to ${url} failed: ${response.statusText}`);
  }
};

const handlePatch = async (url, body, queryParams = null, jwtToken = null) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  
  const headers = {
    'Content-Type': 'application/json',
  };
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(body),
  });
  
  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  } else {
    throw new Error(`PATCH request to ${url} failed: ${response.statusText}`);
  }
};

export { 
  handleGet, 
  handlePost, 
  handleDelete,
  handlePatch,
  API_URL,
  ROOMS_ENDPOINT, 
  USERS_ENDPOINT,
  AUTH_ENDPOINT,
  BIDS_ENDPOINT
};