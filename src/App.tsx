import React from "react"; // Importerar React

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Firstpage from "../firstpage";
import Secondpage from "../secondpage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Firstpage />} />
        <Route path="/secondpage/:symbol" element={<Secondpage />} />
      </Routes>
    </Router>
  );
};

export default App;
