import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../context/CitiesProvider";
export default function CountryList() {
  const { isLoading, cities } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Mark The place you have visited in map" />;
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);
  return (
    <div className={styles.countryList}>
      {countries.map((country) => (
        <ul>
          <CountryItem country={country} key={country.country} />
        </ul>
      ))}
    </div>
  );
}
