import { useEffect, useState } from "react";

export default function useCurrUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (err) {
      console.error("Error reading user from localStorage", err);
    }
  }, []);

  return user;
}
