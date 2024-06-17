import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Home from './Home'; // Create a Home component in a separate file
// import About from './About';  // Create an About component in a separate file

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to My React App</h1>
      </div>        
      <nav>
        <ul>
          <li>
            {/* <Link to="/">Home</Link> */}
          </li>
          <li>
            {/* <Link to="/about">About</Link> */}
          </li>
        </ul>
      </nav>
    </Router>
  );
}

export default App;
