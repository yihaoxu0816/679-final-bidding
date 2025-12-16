import { createContext, useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";

import Root from "./pages/root";
import AllRooms from "./pages/allRooms";
import BiddingRoom from "./pages/BiddingRoom";
import CreateEditRoom from "./pages/CreateEditRoom";
import Profile from "./pages/Profile";
import Login from "./pages/login";
import { getCurrentUser } from "./data/users";


const CurrentUserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Restore user from localStorage on mount
  useEffect(() => {
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          index: true,
          element: <AllRooms />,
        },
        {
          path: "rooms/new",
          element: <CreateEditRoom />,
        },
        {
          path: "rooms/:id",
          element: <BiddingRoom />,
        },
        {
          path: "rooms/:id/edit",
          element: <CreateEditRoom />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "login",
          element: <Login />,
        }
      ],
    },
  ]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <RouterProvider router={router} />
    </CurrentUserContext.Provider>
  );
}

export default App;
export { CurrentUserContext };
