import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useData } from "../contexts/DataContext";
import { Bitcoin, Menu, X } from 'lucide-react'

function Navbar() {
  const router = useRouter();
  const { account, loadWeb3 } = useData();

  return (
    <>
      <nav className="w-full h-16 mt-auto pt-8 px-6">
        <div className="flex flex-row justify-between items-center h-full">
          <Link href="/" passHref>
            <div className="flex-shrink-0 flex items-center">
              <Bitcoin className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700">
                SATOSHI BETS
              </span>
            </div>
          </Link>
          {!router.asPath.includes("/market") &&
            !router.asPath.includes("/admin") && (
              <div className="flex flex-row items-center justify-center h-full gap-4">
                <TabButton
                  title="Market"
                  isActive={router.asPath === "/"}
                  url={"/"}
                />
                <TabButton
                  title="Portfolio"
                  isActive={router.asPath === "/portfolio"}
                  url={"/portfolio"}
                />
              </div>
            )}
          {account ? (
            <div className="bg-yellow-600 px-6 py-2 rounded-md cursor-pointer">
              <span className="text-2lg font-extrabold text-white">
                {account.substr(0, 10)}...
              </span>
            </div>
          ) : (
            <div
              className="bg-yellow-500 px-6 py-2 rounded-md cursor-pointer"
              onClick={() => {
                loadWeb3();
              }}
            >
              <span className="text-lg text-white">Connect</span>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

const TabButton = ({
  title,
  isActive,
  url,
}: {
  title: string;
  isActive: boolean;
  url: string;
}) => {
  return (
    <Link href={url} passHref>
      <div
        className={`h-full px-4 flex items-center border-2 font-semibold hover:border-yellow-700 hover:text-yellow-700 cursor-pointer ${isActive
          ? "border-yellow-700 text-yellow-700 text-lg font-semibold"
          : "border-white text-gray-400 text-lg"
          }`}
      >
        <span>{title}</span>
      </div>
    </Link>
  );
};
