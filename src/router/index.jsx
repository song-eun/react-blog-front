import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from '../common/DefaultLayout'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'
import { CreatePostPage } from '../pages/CreatePostPage'
import { PostListPage } from '../pages/PostListPage'
import { PostDetailPage } from '../pages/PostDetailPage'
import { EditPost } from '../pages/EditPost'
import { UserPage } from '../pages/UserPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      { index: true, element: <PostListPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/createPost', element: <CreatePostPage /> },
      { path: '/post/:postId', element: <PostDetailPage /> },
      { path: '/edit/:postId', element: <EditPost /> },
      { path: '/users/:username', element: <UserPage /> },
    ],
  },
])
