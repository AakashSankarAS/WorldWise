import { createContext, useContext, useReducer } from "react";

const Authentication = createContext();

const initialValue = {
  user: null,
  isAuthenticated: false,
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "Login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "Logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Invalid Action Type");
  }
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialValue
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "Login", payload: FAKE_USER });
  }

  const logout = () => {
    dispatch({ type: "Logout" });
  };
  return (
    <Authentication.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </Authentication.Provider>
  );
}

function useAuth() {
  const Authenticated = useContext(Authentication);
  if (!Authenticated) throw new Error(" useAuth is outside the AuthProvider");
  return Authenticated;
}

export { AuthProvider, useAuth };
