import Img from "next/image";
import Link from "next/link";
import React from "react";
import Web3 from "web3";
import { MarketProps } from "../pages";

export const MarketCard: React.FC<MarketProps> = ({
  id,
  title,
  totalAmount,
  totalYes,
  totalNo,
  imageHash,
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg backdrop-blur-sm hover:bg-gray-800 w-96">
      <Link href={`/market/${id}`} passHref>
        <div className="flex flex-col border border-gray-300 rounded-lg p-3 hover:border-blue-700 cursor-pointer">
          <div className="flex flex-row space-x-5 pb-8">
            <div className="w-12  h-w-12">
              <Img
                src={`/Bitcoin.png`}
                className="rounded-full"
                width={100}
                height={100}
              />
            </div>
            <span className="text-lg font-semibold mb-2 text-white">{title}</span>
          </div>
          <div className="flex flex-col flex-nowrap justify-between items-center">
            <div className="flex flex-row space-y-1 w-full items-stretch justify-between text-lg">
              <span className="text-lg text-gray-500 font-light">Volume</span>
              <span className="text-lg text-white">
                {parseFloat(Web3.utils.fromWei(totalAmount, "ether")).toFixed(
                  2
                )}{" "}
                cBTC
              </span>
            </div>
            <div className="flex flex-row gap-6 mt-4 items-stretch justify-around">
              <div className="flex flex-col space-y-1 py-2 px-2 bg-green-500 hover:bg-green-500 text-white border border-green-500/50 rounded-md transition-colors">
                <span className="text-md font-medium text-green-900">
                  Yes {parseFloat(Web3.utils.fromWei(totalYes, "ether")).toFixed(2)}{" "}
                  cBTC
                </span>
              </div>
              <div className="flex flex-col space-y-1 py-2 px-2 bg-red-500 hover:bg-red-500 text-white border border-green-500/50 rounded-md transition-colors">
                <span className="text-md font-medium text-red-900">
                  No {parseFloat(Web3.utils.fromWei(totalNo, "ether")).toFixed(2)}{" "}
                  cBTC
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
