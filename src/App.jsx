
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserDetails from './components/UserDetails';
import Body from './components/Body';
import Error from './components/Error';

function App() {
  const appRouter = createBrowserRouter([
    {
      path:'/',
      element:<Body/>,
      children:[
        {
           path:'/',
           element:<Dashboard/>
        },
        {
          path:'/userDetails/:id',
          element:<UserDetails/>
        }
      ],
      errorElement: <Error />,
    }
  ])
  return (
    <div>
     <RouterProvider router={appRouter}/>
    </div>
  );
}

export default App
