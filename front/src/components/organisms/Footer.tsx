export default function Footer() {
  return (
      <footer className="bg-black text-white">
          <div className="container mx-auto flex justify-center items-center">
          <a href="/privacy" className="text-lg hover:underline px-4">
            Privacy & Term
          </a>
          <a href="/contact" className="text-lg hover:underline px-4">
            Contact
          </a>
        </div>
        <div className="text-center mt-1 text-sm">
          Copyright © Mick. All rights reserved.
        </div>
      </footer>
  );
}
