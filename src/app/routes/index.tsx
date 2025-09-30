import { createBrowserRouter, redirect } from "react-router-dom";
import Layout from "@/app/layout/Layout";
import { routes } from "./config";
import HomePage from "@/features/home/pages/HomePage";
import EditPage from "@/features/dashboard/pages/EditPage/EditPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import NotFoundPage from "@/features/404/pages/NotFoundPage";
import { ImageSelector } from "@/features/dashboard/components/ImageSelector/ImageSelector";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: routes.home,
        element: <HomePage />,
      },
      {
        path: routes.dashboard,
        element: <DashboardPage />,
        children: [
          {
            index: true,
            element: <ImageSelector />,
          },
          {
            path: "edit",
            loader: () => redirect(routes.dashboard),
          },
          {
            path: routes.edit,
            element: <EditPage />,
            loader: ({ params }) => {
              if (!params.imageId) {
                redirect(routes.dashboard);
              }

              return { imageId: params.imageId };
            },
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
