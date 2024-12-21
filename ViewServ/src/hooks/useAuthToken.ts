import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const jwtToken = Cookies.get('jwt'); // Get the token from the cookie
    setToken(jwtToken || null); // Set the token state
  }, []);

  return token; // Return the token
};

export default useAuthToken; 