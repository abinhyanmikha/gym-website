import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 px-6">
      {/* Parent container: stacks on mobile, row on bigger screens */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-6">
        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-4 text-center sm:text-left">
          <Link
            href="/Terms&Conditions"
            className="text-white hover:text-gray-400 font-bold"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/Support"
            className="text-white hover:text-gray-400 font-bold"
          >
            Support
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm order-last sm:order-none">
          © {new Date().getFullYear()} Ajima Physical Fitness. All rights
          reserved.
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-3">
          <a
            href="https://www.facebook.com/ajimaphysicalfitness/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/fb.svg"
              alt="Facebook"
              width={36}
              height={36}
              className="hover:opacity-80 transition"
            />
          </a>
          <a
            href="https://www.instagram.com/ajimaphysicalfitness/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/insta.svg"
              alt="Instagram"
              width={36}
              height={36}
              className="hover:opacity-80 transition"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
