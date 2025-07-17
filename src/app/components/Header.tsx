export default function Header() {
    return (
      <header className="p-4 shadow-md bg-white  top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Psychologue</h1>
          <nav className="space-x-4">
            <a href="#about" className="hover:underline">À propos</a>
            <a href="#services" className="hover:underline">Services</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>
    )
  }
  