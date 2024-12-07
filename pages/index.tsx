import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Filter } from "../components/Filter";
import { MarketCard } from "../components/MarketCard";
import Navbar from "../components/Navbar";
import { useData } from "../contexts/DataContext";
import styles from "../styles/Home.module.css";

export interface MarketProps {
  id: string;
  title: string;
  imageHash: string;
  totalAmount: string;
  totalYes: string;
  totalNo: string;
}

export default function Home() {
  const { polymarket, account, loadWeb3, loading } = useData();
  const [markets, setMarkets] = useState<MarketProps[]>([]);

  const getMarkets = useCallback(async () => {
    var totalQuestions = await polymarket.methods
      .totalQuestions()
      .call({ from: account });
    var dataArray: MarketProps[] = [];
    for (var i = 0; i < totalQuestions; i++) {
      var data = await polymarket.methods.questions(i).call({ from: account });
      dataArray.push({
        id: data.id,
        title: data.question,
        imageHash: data.creatorImageHash,
        totalAmount: data.totalAmount,
        totalYes: data.totalYesAmount,
        totalNo: data.totalNoAmount,
      });
    }
    setMarkets(dataArray);
  }, [account, polymarket]);

  useEffect(() => {
    loadWeb3().then(() => {
      if (!loading) getMarkets();
    });
  }, [loading]);

  return (
    <div className={`styles.container min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800`}>
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-center bg-cover" />
        <div className="container mx-auto px-4 py-16">
          <h1 className="md:text-6xl leading-loose font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-900 mb-2">
            Biggest prediction market on Bitcoin
          </h1>
          <p className="text-xl text-center text-gray-400 mb-8">

          </p>
          <h4 className="md:text-4xl leading-loose font-bold text-center text-gray-400 mb-2">
            with Bitcoin, for Bitcoin
          </h4>
        </div>
      </div>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full flex flex-col flex-wrap sm:flex-nowrap py-4 flex-grow px-16">
        <div className="w-full flex flex-col flex-grow pt-1">
          <div className="relative text-gray-500 focus-within:text-gray-400 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center px-3">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="search"
              name="q"
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md pl-10 focus:outline-none"
              placeholder="Search markets..."
              autoComplete="off"
            />
          </div>
          <div className="flex flex-row space-x-2 md:space-x-5 items-center flex-wrap mt-4">
            <Filter
              list={["All", "Price Prediction", "Network Events", "Network Metrics"]}
              activeItem="All"
              category="Category"
              onChange={() => { }}
            />
            <Filter
              list={["Volume", "Newest", "Expiring"]}
              activeItem="Volume"
              category="Sort By"
              onChange={() => { }}
            />
          </div>
          <div>

          </div>
          <span className="font-bold my-3 text-lg text-white">Market</span>
          <div className="flex flex-wrap overflow-hidden">
            {markets.map((market) => {
              return (
                <MarketCard
                  id={market.id}
                  key={market.id}
                  title={market.title}
                  totalAmount={market.totalAmount}
                  totalYes={market.totalYes}
                  totalNo={market.totalNo}
                  imageHash={market.imageHash}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
