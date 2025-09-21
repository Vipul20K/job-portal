// import React, { createContext, useState } from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";

// export const Context = createContext({
//   isAuthorized: false,
// });

// const AppWrapper = () => {
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [user, setUser] = useState({});

//   return (
//     <Context.Provider
//       value={{
//         isAuthorized,
//         setIsAuthorized,
//         user,
//         setUser,
//       }}
//     >
//       <App />
//     </Context.Provider>
//   );
// };

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AppWrapper />
//   </React.StrictMode>
// );
import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";

export const Context = createContext({
  isAuthorized: false,
  loading: true,
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/me`,
          { withCredentials: true }
        );
        setIsAuthorized(true);
        setUser(data.user);
      } catch (error) {
        setIsAuthorized(false);
        setUser({});
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
        loading,
      }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
