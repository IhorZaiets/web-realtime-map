import { router } from '@/pages/router'
import { configure } from 'mobx'
import { RouterProvider } from 'react-router-dom'

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  disableErrorBoundaries: true,
})

function App() {
  return <RouterProvider router={router} />
}

export default App
