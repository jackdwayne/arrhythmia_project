
import './App.css';
import {UserInfo, CreateUser} from './components/Users';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">

      <Dashboard/>
      <CreateUser/>
      <UserInfo/>

    </div>
  );
}

export default App;
