import XhsEditor from './components/XhsEditor'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold text-[#ff2442]">小红书风格编辑器</h1>
        <p className="text-gray-600 mt-2">编辑内容并生成1080x1920的图片</p>
      </header>
      
      <main className="container mx-auto px-4">
        <XhsEditor />
      </main>
      
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2024 小红书编辑器</p>
      </footer>
    </div>
  )
}

export default App
