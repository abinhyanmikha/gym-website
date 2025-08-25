import Link from "next/link";
export default function Navbar() {
  return (
    <div className="w-full flex justify-between px-10 h-20 items-center fixed text-2xl position-sticky  bg-white z-10">
      <Link href="/" className="flex gap-2 items-center">
        <span className="font-bold">Home</span>
      </Link>
      <Link href="/AboutUs" className="flex gap-2 items-center">
        <span className="font-bold">About Us</span>
      </Link>
      <Link href="/Services" className="flex gap-2 items-center">
        <span className="font-bold">Services</span>
      </Link>
      <Link href="/Membership-Plans" className="flex gap-2 items-center">
        <span className="font-bold">Membership Plans</span>
      </Link>
      <Link href="/" className="flex gap-2 items-center">
        <span className="font-bold">Gallery</span>
      </Link>
      <Link href="/Reviews" className="flex gap-2 items-center">
        <span className="font-bold">Reviews</span>
      </Link>
      <Link href="/More" className="flex gap-2 items-center">
        <span className="font-bold">More</span>
      </Link>
      <Link href="/ContactUs" className="flex gap-2 items-center">
        <button className="font-bold border-2 border-gray-950 bg-blue-500 rounded-2xl">
          Contact Us
        </button>
      </Link>
    </div>
  );
}
