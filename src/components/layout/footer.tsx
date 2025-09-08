import Link from "next/link";
import { SocialLinks } from "@/components/about";

export const Footer: React.FC = () => {
  return (
    <footer className="container">
      <div className="mb-6 rounded-2xl bg-neutral-900 p-8 text-neutral-200 shadow-lg">
       
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          <div>
            <h4 className="mb-4 text-2xl font-extrabold tracking-tight text-white">
              Luis Alberto CZ
            </h4>
            <p className="text-sm leading-relaxed text-neutral-400">
              Built with ❤️ by{" "}
              <a
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                href="https://github.com/condoriluis"
                target="_blank"
                rel="noopener noreferrer"
              >
                condoriluis
              </a>
              . <br />
              Source code available on{" "}
              <a
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                href="https://github.com/condoriluis/pdf-generator-catalogo"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold tracking-tight text-white">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-blue-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-blue-400 transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
              
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold tracking-tight text-white">
              Connect
            </h4>
            <div className="flex space-x-1">
              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="my-6 border-t border-neutral-700" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-neutral-500 md:flex-row">
          <span>© {new Date().getFullYear()} Luis Alberto CZ. All rights reserved.</span>
          <span className="text-neutral-600">Crafted with Next.js & TailwindCSS & <a href="https://ui.shadcn.com/docs/components" target="_blank" className="font-medium text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"> Shadcn UI</a></span>
        </div>
        
      </div>
    </footer>
  );
};
