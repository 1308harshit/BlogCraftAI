export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">BlogCraft AI</h3>
            <p className="text-gray-400 mb-4">
              Generate Google-optimized blog posts in 60 seconds. 
              The fastest way to scale your content marketing.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/generator" className="hover:text-white">Free Demo</a></li>
              <li><a href="/#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/#features" className="hover:text-white">Features</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/login" className="hover:text-white">Log In</a></li>
              <li><a href="/signup" className="hover:text-white">Sign Up</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BlogCraft AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}