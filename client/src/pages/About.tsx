import React from 'react';

const About: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">About Us</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 text-gray-600 leading-relaxed border border-gray-100">
        <p>
          Welcome to AntigravityShop! We are dedicated to providing you with the best products, focusing on dependability, customer service, and uniqueness.
        </p>
        <p>
          Founded in 2026, AntigravityShop has come a long way from its beginnings. When we first started out, our passion for high-quality, sustainable products drove us to do intense research, and gave us the impetus to turn hard work and inspiration into to a booming online store. We now serve customers all over the world.
        </p>
        <p>
          We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p>
            To bring the best user experience to customers through innovative products and services. We strive to create an ecosystem that empowers creators and consumers alike.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
