import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
 import MyHomes from "./MyHomes";
import UserDashboard from "./UserDashboard";
import HowItWorks from "./HowItWorks";
import Contact from "./Contact";
import PropertyDetails from "./PropertyDetails";
import AddProperty from "./AddProperty";
import SignUp from "./SignUp";
import EditProperty from "./EditProperty";
import Login from "./login";
import "./i18n";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <BrowserRouter>

<Routes>
  <Route
  path="/edit-property/:id"
  element={<EditProperty />}
/>
<Route path="/login" element={<Login />} /> 
  <Route path="/my-homes" element={<MyHomes />} />
  <Route path="/" element={<UserDashboard />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/how-it-works" element={<HowItWorks />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/property/:id" element={<PropertyDetails />} />
  <Route path="/add-property" element={<AddProperty />} />
</Routes>
  </BrowserRouter>
);