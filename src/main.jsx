import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import ErrorPage from './routes/error-page';
import Root, {
  loader as rootLoader,
  action as rootAction,
} from './routes/root';
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from './routes/contact';
import EditContact, { action as editAction } from './routes/edit';
import { action as destroyAction } from './routes/destroy';
import Index from './routes/index';

// The form has an action ex.destroy action.You submit
// the form and it goes to the page / actionRoute so on
// the contacts page if there is a destroy action
// action: destroy it goes to the path contacts / destroy
// on the router page.The action on that page is the
// action it goes to.So action on the destroy route
// destroys the contact then redirects.

// action is used for form data when you hit
// submit it is sent here to action

// Note the { index: true } instead of { path: "" }.That
// tells the router to match and render this route when
// the user is at the parent route's exact path, so
// there are no other child routes to render
//   in the < Outlet >.

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    // Loader provides data to route prior to rendering
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        // Pathless route will display any errors here versus
        // setting an error at each child
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: 'contacts/:contactId',
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: 'contacts/:contactId/edit',
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: 'contacts/:contactId/destroy',
            action: destroyAction,
            errorElement: <div>Oops! There was an error. </div>,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
