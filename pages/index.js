// import { NextPage } from 'next'
import Head from "next/head";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Modal from "../components/Modal";

const Home = () => {
  return (
    <div className="">
      <Head>
        <title>My Instagram (Eliez App)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Feed />

      {/* <Modal isvisible/> */}
    </div>
  );
};

export default Home;
