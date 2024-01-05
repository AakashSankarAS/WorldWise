import { createContext, useContext, useEffect, useReducer } from "react";
const url = "http://localhost:9000";

const ContextProvider = createContext();
const initialValue = {
  isLoading: false,
  cities: [],
  currentCity: {},
  error: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "citiesLoaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "citiesLoading":
      return {
        ...state,
        isLoading: true,
      };
    case "cityCreated":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "updateCurrCity":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "cityDeleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => action.payload !== city.id),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        error: action.payload,
      };
    default:
      throw new Error("Invalid Action Type");
  }
};

function CitiesProvider({ children }) {
  const [{ isLoading, currentCity, cities, error }, dispatch] = useReducer(
    reducer,
    initialValue
  );

  // const [isLoading, setLoading] = useState(false);
  // const [cities, setCities] = useState([]);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: "citiesLoading" });
      try {
        // setLoading(true);

        const res = await fetch(`${url}/cities`);
        const data = await res.json();
        dispatch({ type: "citiesLoaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "Can't able to fetch cities" });
      } //  finally {
      //   setLoading(false);
      // }
    }
    fetchData();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "citiesLoading" });
    try {
      // setLoading(true);
      const res = await fetch(`${url}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "updateCurrCity", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Can't able to get the city" });
    } //  finally {
    //   setLoading(false);
    // }
  }

  async function createCity(newCity) {
    dispatch({ type: "citiesLoading" });
    try {
      // setLoading(true);
      const res = await fetch(`${url}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "cityCreated", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Can't able to Add the city" });
    }
    // finally {
    //   setLoading(false);
    // }
  }

  async function deleteCity(id) {
    dispatch({ type: "citiesLoading" });
    try {
      // setLoading(true);
      await fetch(`${url}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "cityDeleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "Can't able to delete the city" });
    }
    // finally {
    //   setLoading(false);
    // }
  }
  return (
    <ContextProvider.Provider
      value={{
        isLoading,
        cities,
        error,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </ContextProvider.Provider>
  );
}
function useCities() {
  const cities = useContext(ContextProvider);
  return cities;
}

export { CitiesProvider, useCities };
