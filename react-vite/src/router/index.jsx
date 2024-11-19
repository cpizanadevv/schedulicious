import { createBrowserRouter , Navigate } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import LandingPage from '../components/LandingPage';
import Layout from './Layout';
import RecipeFormPage from '../components/RecipeFormPage';
import AllRecipesPage from '../components/AllRecipesPage/AllRecipes';
import RecipePage from '../components/RecipePage/RecipePage';
import RecipeUpdate from '../components/RecipeFormPage/RecipeUpdatePage.jsx';
import CalendarView from '../components/CalenderViewSchedule/CalendarView.jsx';
import Calendar from '../components/CalenderViewSchedule/Calendar.jsx';
import ScheduleDay from '../components/ScheduleFormPage/ScheduleDay.jsx';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage/>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "create-recipe",
        element: <RecipeFormPage />,
      },
      {
        path: "update-recipe/:recipeId",
        element: <RecipeUpdate />,
      },
      {
        path: "recipes",
        element: <AllRecipesPage />,
      },
      {
        path: "recipes/:recipeId",
        element: <RecipePage />,
      },
      {
        path: "calendar-view/schedule/:date/:day",
        element: <ScheduleDay />,
      },
      {
        path:'calendar-view',
        element:<CalendarView/>
      },
      {
        path:'calendar',
        element:<Calendar/>
      },
      {
        path: '*',
        element:<Navigate to="/"/>
      },
    ],
  },
]);