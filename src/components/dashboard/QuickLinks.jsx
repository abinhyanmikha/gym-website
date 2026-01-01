import React from "react";

const QuickLinks = ({ links }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-colors"
          >
            <h3 className="font-medium">{link.label}</h3>
            <p className="text-sm text-gray-500">{link.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
