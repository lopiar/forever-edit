import Navigation from "../Navigation";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1>Daniel's App</h1>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
