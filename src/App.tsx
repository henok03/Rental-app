import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SignUp from "./SignUp";
import UserDashboard from "./UserDashboard";
import HowItWorks from "./HowItWorks";
import Contact from "./Contact";
import PropertyDetails from "./PropertyDetails";
import AddProperty from "./AddProperty";
 import MyHomes from "./MyHomes";
 import EditProperty from "./EditProperty";
import Login from "./login";
import LanguageToggle from "./LanguageToggle";
import "./i18n";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <BrowserRouter>
    <LanguageToggle dark={false} t={undefined} />

    <Routes>
      <Route path="/my-homes" element={<MyHomes />} />
      <Route
        path="/edit-property/:id"
        element={<EditProperty />}
      />
      <Route path="/" element={<UserDashboard />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/add-property"
        element={<AddProperty />}
      />
      <Route
        path="/property/:id"
        element={<PropertyDetails />}
      />
    </Routes>
  </BrowserRouter>
);