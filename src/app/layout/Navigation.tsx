import { NavLink } from "react-router-dom";
import { navigation } from "../routes/config";

const Navigation = () => {
  return (
    <nav>
      <ul style={{ display: "flex", gap: "1rem" }}>
        {navigation.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) => (isActive ? "active" : "")}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                textDecoration: "none",
              })}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
