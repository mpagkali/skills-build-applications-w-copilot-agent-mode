import { NavLink, Navigate, Route, Routes } from 'react-router-dom'

const sections = [
  { label: 'Dashboard', path: '/' },
  { label: 'Activities', path: '/activities' },
  { label: 'Teams', path: '/teams' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Workouts', path: '/workouts' },
]

function SectionPage({ title }: { title: string }) {
  return (
    <main className="container py-5">
      <h1 className="h2 mb-2">{title}</h1>
      <p className="text-secondary mb-0">Your {title.toLowerCase()} workspace is ready.</p>
    </main>
  )
}

export default function App() {
  return (
    <>
      <header className="navbar navbar-expand bg-dark navbar-dark">
        <div className="container flex-wrap gap-2">
          <a className="navbar-brand d-flex align-items-center gap-2" href="/">
            <img src="/octofitapp-small.png" width="36" height="36" alt="" />
            <span>OctoFit Tracker</span>
          </a>
          <nav className="nav" aria-label="Main navigation">
            {sections.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <Routes>
        {sections.map(({ label, path }) => (
          <Route key={path} path={path} element={<SectionPage title={label} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
