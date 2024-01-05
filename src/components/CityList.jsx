import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../context/CitiesProvider";
export default function CityList() {
  const { isLoading, cities } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Mark The place you have visited in map" />;
  return (
    <div className={styles.cityList}>
      {cities.map((city) => (
        <ul>
          <CityItem city={city} key={city.id} />
        </ul>
      ))}
    </div>
  );
}
