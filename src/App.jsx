import { useState } from 'react'
import { Header, Main, Sidebar } from './components'

const App = () => {

  const [theme, setTheme] = useState("dark");

  return (
    <main className={`${theme} flex items-start justify-start w-screen h-screen overflow-hidden bg-(--Background)`}>
      <div className='h-screen flex flex-col justify-between'>
        <Header theme={theme} setTheme={setTheme} />
        <Main />
      </div>
    </main>
  )
}

export default App