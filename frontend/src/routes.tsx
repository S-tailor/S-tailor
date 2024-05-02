import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

// RouteType 인터페이스 수정
interface RouteType {
  path: string
  element?: React.LazyExoticComponent<React.ComponentType> // element를 선택적 프로퍼티로 변경
  children?: RouteType[] // Omit 사용 대신 직접 RouteType 배열을 지정
}

const routes: RouteType[] = [
  {
    path: '/',
    element: React.lazy(() => import('./pages/mobile/main')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/main/Main'))
      }
    ]
  },
  {
    path: '/mobile/start',
    element: React.lazy(() => import('./pages/mobile/start')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/start/Start'))
      }
    ]
  },
  {
    path: '/mobile/login',
    element: React.lazy(() => import('./pages/mobile/login')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/login/Login'))
      }
    ]
  },
  {
    path: '/mobile/signup',
    element: React.lazy(() => import('./pages/mobile/signup')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/signup/Signup'))
      }
    ]
  },
  {
    path: '/mobile/profile',
    element: React.lazy(() => import('./pages/mobile/profile')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/profile/Profile'))
      },
      {
        path: 'add',
        element: React.lazy(() => import('./components/mobile/profile/ProfileAdd'))
      },
      {
        path: 'add/info',
        element: React.lazy(() => import('./components/mobile/profile/ProfileAddInfo'))
      },
      {
        path: 'edit',
        element: React.lazy(() => import('./components/mobile/profile/ProfileEdit'))
      }
    ]
  },
  {
    path: '/mobile/closet',
    element: React.lazy(() => import('./pages/mobile/closet')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/closet/Closet'))
      },
      {
        path: 'search',
        element: React.lazy(() => import('./components/mobile/closet/ClosetSearch'))
      },
      {
        path: 'wishlist',
        element: React.lazy(() => import('./components/mobile/closet/ClosetWishList'))
      },
      {
        path: 'code/input',
        element: React.lazy(() => import('./components/mobile/closet/ClosetCodeInput'))
      },
      {
        path: 'tryon/wait',
        element: React.lazy(() => import('./components/mobile/closet/ClosetWait'))
      }
    ]
  },
  {
    path: '/mobile/add-cloth',
    element: React.lazy(() => import('./pages/mobile/addcloth')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/addcloth/AddCloth'))
      }
    ]
  },
  {
    path: '/mobile/mypage',
    element: React.lazy(() => import('./pages/mobile/mypage')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/mypage/MyPage'))
      }
    ]
  },

  {
    path: '/mobile/ask',
    element: React.lazy(() => import('./pages/mobile/ask')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/mobile/ask/Ask'))
      }
    ]
  },
  {
    path: '/mobile/camera',
    element: React.lazy(() => import('./components/mobile/Camera'))
  },
  {
    path: '/flip/main',
    element: React.lazy(() => import('./pages/flip/main')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/flip/main/FlipMain'))
      }
    ]
  },
  {
    path: '/flip/tryon',
    element: React.lazy(() => import('./pages/flip/tryon')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('./components/flip/tryon/TryOn'))
      },
      {
        path: 'code',
        element: React.lazy(() => import('./components/flip/tryon/TryOnCode'))
      }
    ]
  }
]

const RenderRoutes: FC = () => {
  const renderRoute = (route: RouteType) => {
    const Element = route.element // For readability and to ensure we don't directly call React.lazy
    return (
      <Route key={route.path} path={route.path} element={Element ? <Element /> : undefined}>
        {route.children?.map((childRoute) => renderRoute(childRoute))}
      </Route>
    )
  }

  return <Routes>{routes.map((route) => renderRoute(route))}</Routes>
}

export default RenderRoutes
