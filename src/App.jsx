import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import routes from './router/AdminRoutes';
import { renderRoutes } from 'react-router-config';

function App() {
  return (
    <div>
      <BrowserRouter>
        {renderRoutes(routes)}
        <Switch>
          <Redirect exact from="/" to="/login" />
          <Redirect exact from="/home" to="/home/information" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
