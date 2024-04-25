import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

// RouteType 인터페이스 수정
interface RouteType {
  path: string
  element?: React.LazyExoticComponent<React.ComponentType<any>> // element를 선택적 프로퍼티로 변경
  children?: RouteType[] // Omit 사용 대신 직접 RouteType 배열을 지정
}

const routes: RouteType[] = [
  {
    path: '/',
    element: React.lazy(() => import('@/pages/login'))
  },
  {
    path: '/tts',
    element: React.lazy(() => import('@/pages/tts'))
  },
  {
    path: '/signup',
    element: React.lazy(() => import('@/pages/signup')),
    children: [
      {
        path: '', // '/signup/complete' 경로를 독립적으로 추가
        element: React.lazy(() => import('@/components/signup/Signup'))
      },
      {
        path: 'complete', // '/signup/complete' 경로를 독립적으로 추가
        element: React.lazy(() => import('@/components/signup/SignupComplete'))
      },
      {
        path: 'account', // '/signup/complete' 경로를 독립적으로 추가
        element: React.lazy(() => import('@/components/signup/SignupAccount'))
      }
    ]
  },
  {
    path: '/mainparent',
    element: React.lazy(() => import('@/pages/mainparent')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('@/components/mainparent/MainParent'))
      },
      {
        path: 'nochild',
        element: React.lazy(() => import('@/components/mainparent/NoChild'))
      },
      {
        path: 'childadd',
        element: React.lazy(() => import('@/components/mainparent/ChildAdd'))
      },
      {
        path: 'childstatus',
        element: React.lazy(() => import('@/components/mainparent/ChildStatus'))
      }
    ]
  },
  {
    path: '/mainchild',
    element: React.lazy(() => import('@/pages/mainchild')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('@/components/mainchild/MainChild'))
      },
      {
        path: 'loading',
        element: React.lazy(() => import('@/components/mainchild/Loading'))
      },
      {
        path: 'story',
        element: React.lazy(() => import('@/components/mainchild/Story'))
      },
      {
        path: 'worldmap',
        element: React.lazy(() => import('@/components/mainchild/WorldMap'))
      },
      {
        path: 'usa',
        element: React.lazy(() => import('@/components/mainchild/USA'))
      },
      {
        path: 'china',
        element: React.lazy(() => import('@/components/mainchild/China'))
      },
      {
        path: 'japan',
        element: React.lazy(() => import('@/components/mainchild/Japan'))
      },
      {
        path: 'italy',
        element: React.lazy(() => import('@/components/mainchild/Italy'))
      },
      {
        path: 'stage/usa',
        element: React.lazy(() => import('@/components/mainchild/USAStage'))
      },
      {
        path: 'stage/italy',
        element: React.lazy(() => import('@/components/mainchild/ItalyStage'))
      },
      {
        path: 'stage/japan',
        element: React.lazy(() => import('@/components/mainchild/JapanStage'))
      },
      {
        path: 'stage/china',
        element: React.lazy(() => import('@/components/mainchild/ChinaStage'))
      },
      {
        path: 'stage/cartoon',
        element: React.lazy(() => import('@/components/mainchild/Cartoon'))
      },
      {
        path: 'stage/quiz/start',
        element: React.lazy(() => import('@/components/mainchild/QuizStart'))
      },
      {
        path: 'stage/quiz',
        element: React.lazy(() => import('@/components/mainchild/Quiz'))
      },
      {
        path: 'stage/result',
        element: React.lazy(() => import('@/components/mainchild/Result'))
      }
    ]
  },
  {
    path: '/parentwallet',
    element: React.lazy(() => import('@/pages/parentwallet')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('@/components/parentwallet/ParentWallet'))
      },
      {
        path: 'request',
        element: React.lazy(() => import('@/components/parentwallet/Request'))
      },
      {
        path: 'send',
        element: React.lazy(() => import('@/components/parentwallet/Sending'))
      },
      {
        path: 'complete',
        element: React.lazy(() => import('@/components/parentwallet/SendingComplete'))
      }
    ]
  },
  {
    path: '/account',
    element: React.lazy(() => import('@/pages/account')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('@/components/account/RegisterAccount'))
      },
      {
        path: 'password',
        element: React.lazy(() => import('@/components/account/RegisterAccountPassword'))
      },
      {
        path: 'create',
        element: React.lazy(() => import('@/components/account/CreateAccount'))
      },
      {
        path: 'complete',
        element: React.lazy(() => import('@/components/account/CompleteAccount'))
      }
    ]
  },
  {
    path: '/childwallet',
    element: React.lazy(() => import('@/pages/childwallet')),
    children: [
      {
        path: '',
        element: React.lazy(() => import('@/components/childwallet/ChildWallet'))
      },
      {
        path: 'point',
        element: React.lazy(() => import('@/components/childwallet/MyPoint'))
      },
      {
        path: 'ask',
        element: React.lazy(() => import('@/components/childwallet/AskWon'))
      },
      {
        path: 'askcomplete',
        element: React.lazy(() => import('@/components/childwallet/AskComplete'))
      },
      {
        path: 'account',
        element: React.lazy(() => import('@/components/childwallet/MyAccount'))
      }
    ]
  },
  {
    path: '/parentcurrency',
    element: React.lazy(() => import('@/pages/parentcurrency'))
  },
  {
    path: '/currency',
    element: React.lazy(() => import('@/components/parentcurrency/Currency'))
  },
  {
    path: '/currency/detail',
    element: React.lazy(() => import('@/components/parentcurrency/CurrencyDetail'))
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
