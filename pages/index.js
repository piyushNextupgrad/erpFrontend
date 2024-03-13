import Head from "next/head";
import Image from "next/image";
import CardComp from "@/components/cardComponent";
import styles from "@/styles/Home.module.css";
import { studentManagement } from "@/components/StaticContent";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.card}>
          {studentManagement.map((item, index) => (
            <CardComp item={item} key={index} />
          ))}
        </div>
      </main>
    </>
  );
}
