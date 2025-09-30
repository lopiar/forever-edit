import { routes } from "@/app/routes/config";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.scss";

const HomePage: React.FC = () => (
  <div className={styles.wrapper}>
    <h1>Welcome ✏️</h1>
    <p>You can start editing images by clicking the button below.</p>
    <Link className="red-btn" to={routes.dashboard}>
      Start Editing Images
    </Link>
  </div>
);

export default HomePage;
