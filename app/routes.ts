import { route, type RouteConfig } from '@react-router/dev/routes'

export default [
  route('/', 'routes/Index/index.tsx'),
  route('/achievements', 'routes/Achievements/index.tsx'),
] satisfies RouteConfig
