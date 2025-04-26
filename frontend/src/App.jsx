import "./App.css";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Counters from "./pages/Subdashboard/Counters";
 import CounterDetail from "./pages/CounterDetail";
 import Temp from "./pages/temp";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home /> },
        // { path: "counters", element: <Counters /> },
     { path: "dashboard/", element: <Dashboard /> },
     { path: "dashboard/*", element: <Dashboard /> },
     { path: "counter-details", element: <CounterDetail /> },
     { path:"temp" ,element: <Temp /> },
   
        // { path: "machine/:id", element: <MachineDashboard /> },


        // {
        //   path: 'admindashboard',
        //   element: (
        //     <PrivateRoute>
        //      <AdiminDashboard/>
        //     </PrivateRoute>
        //   ),
        // },
 
       
      ],
    },
  ]);

  return (
    <>
     
      <RouterProvider router={router} />
    </>
  );
}

export default App;
