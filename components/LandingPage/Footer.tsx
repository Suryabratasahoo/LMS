import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2023 PayrollPro, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

