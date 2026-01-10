import { useState } from 'react'
import { Auth, Header, Main, Sidebar } from './components'

const App = () => {

  const [theme, setTheme] = useState("dark");
  const [sInPage, setSInPage] = useState(true)

  return (
    <main className={`${theme} flex items-start justify-start w-screen h-screen overflow-hidden bg-(--Background)`}>
      {sInPage &&(<div className='h-screen flex flex-col justify-between'>
        <Header theme={theme} setTheme={setTheme} />
        <Main />
      </div>) ||
        <Auth />
        }
    </main>
  )
}

export default App