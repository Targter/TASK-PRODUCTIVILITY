import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
      <p>
        Built by Abhay Bansal |{" "}
        <Link
          href="https://abhaybansal.in"
          target="_blank"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Portfolio
        </Link>
      </p>
    </footer>
  );
}
