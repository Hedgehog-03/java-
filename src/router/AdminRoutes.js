import Login from '../components/login';
import HomeMain from '../components/home/main';
import HomeInformation from '../components/home/information'
import HomeTrain from '../components/home/train';
import Performance from '../components/home/performance'
import Interview from '../components/home/interview'
import Check from '../components/home/check/Check'
import Vacate from '../components/home/vacate/Vacate'
import Position from '../components/home/position/Position'
import Payment from '../components/home/payment/Payment'
const routes = [
  {
    path: "/login",
    exact: true,
    component: Login,
  },
  {
    path: "/home",
    component: HomeMain,
    routes: [
      {
        path: "/home/information",
        exact: true,
        component: HomeInformation,
      },
      {
        path: "/home/train",
        component: HomeTrain,
      },
      {
        path: "/home/performance",
        component: Performance,
      },
      {
        path: "/home/interview",
        component: Interview,
      },
      {
        path: "/home/check",
        component: Check,
      },
      {
        path: "/home/vacate",
        component: Vacate,
      },
      {
        path: "/home/position",
        component: Position,
      },
      {
        path: "/home/payment",
        component: Payment,
      },
    ]
  },
]
export default routes;