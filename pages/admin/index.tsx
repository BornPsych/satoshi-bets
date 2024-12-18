import { create } from "ipfs-http-client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useData } from "../../contexts/DataContext";

const Admin = () => {
  const router = useRouter();
  const { polymarket, loadWeb3, account } = useData!();
  const [loading, setLoading] = React.useState(false);
  const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageHash, setImageHash] = React.useState("");
  const [resolverUrl, setResolverUrl] = React.useState("");
  const [timestamp, setTimestamp] = React.useState<
    string | number | readonly string[] | undefined
  >(Date());

  const uploadImage = async (e: any) => {
    // const file = e.target.files[0];
    // const added = await client.add(file);
    // setImageHash(added.path);
  };

  useEffect(() => {
    loadWeb3();
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);
    await polymarket.methods
      .createQuestion(title, imageHash, description, resolverUrl, timestamp)
      .send({
        from: account,
      });
    setLoading(false);
    setTitle("");
    setDescription("");
    setImageHash("");
    setResolverUrl("");
    setTimestamp(undefined);
    router.push("/");
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full p-5 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Head>
          <title>Polymarket</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="w-full flex flex-col py-4 max-w-5xl pb-6">
          <Link href="/admin/markets">
            <a className="mt-5 rounded-lg py-3 text-center w-full bg-blue-700 text-white font-bold mb-5">
              See All Markets
            </a>
          </Link>
          <div className="w-full flex flex-col border border-gray-300 p-5 rounded-lg mt-4">
            <span className="text-2xl font-bold text-white">Add New Market</span>
            <span className="text-lg font mt-6 mb-1">Market Title</span>
            <input
              type="input"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              placeholder="Title"
              autoComplete="off"
            />
            <span className="text-lg font mt-6 mb-1">Market Description</span>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              placeholder="Description"
              autoComplete="off"
            ></textarea>
            <span className="text-lg font mt-6 mb-1">Market Title Image</span>
            <input type="file" onChange={uploadImage} />
            <div className="mt-4">
              <label htmlFor="resolveUrl" className="block text-sm font-medium text-white mb-1">Resolve URL</label>
              <div className="relative">
                <input
                  id="resolveUrl"
                  type="url"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter resolve URL"
                  onChange={(e) => setResolverUrl(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <span className="text-lg font mt-6 mb-1">End Date</span>
            <input
              type="date"
              name="timestamp"
              // value={timestamp}
              onChange={(e) => {
                setTimestamp(e.target.valueAsDate?.getTime());
              }}
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
              autoComplete="off"
            />
            {loading ? (
              <span className="text-center pt-5 pb-3 text-xl font-bold">
                Loading...
              </span>
            ) : (
              <button
                className="mt-5 rounded-lg py-3 text-center w-full bg-green-500 text-white font-bold"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Create Market
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;
