import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 text-center border-t border-gray-200">
      <p className="text-gray-500 text-sm tracking-wide">
        &copy; {currentYear} SmartPark PSSMS. All rights reserved.
      </p>
      <p className="text-gray-400 text-xs mt-1">
        Made with ❤️ by <span className="font-bold text-blue-600">witfab dev</span>
      </p>
    </footer>
  );
}

export default Footer;