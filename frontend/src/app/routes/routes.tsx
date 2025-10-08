import type { RouteObject } from "react-router";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { LoginPage } from "@/modules/auth/pages/LogInPage";
import { SignUpPage } from "@/modules/auth/pages/SignUpPage";


export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        lazy: async () => {
          const { Dashboard } = await import("@/modules/dashboard/pages/Dashboard");
          return { Component: Dashboard };
        },
      },
      {
        path: "/board/:boardId",
        lazy: async () => {
          const { Board } = await import("@/modules/boards/pages/Board");
          return { Component: Board };
        },
      }
    ],
  },
]