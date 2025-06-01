import { useNavigate } from "react-router-dom";

const Profile = () => {
  // 1. Call the hook at the top‐level of your component:
  const navigate = useNavigate();

  // 2. Safely read from localStorage. If there's no “user” item, JSON.parse(null) will give `null`.
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const handleLogout = () => {
    // 3. Now you can use `navigate` here:
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="form-box">
      <h2>Welcome, {user?.name || "Guest"}</h2>
      <p>Username: {user?.username || "-"}</p>
      <p>Email: {user?.email || "-"}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
