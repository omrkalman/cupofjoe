import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import Router from "./routes/router";
import Navbar from "./components/Navbar/Navbar";
import styles from './App.module.css';
import useUserInfo from "./hooks/useUserInfo";

export default function App() {
  
  const userInfo = useUserInfo();
  useEffect(() => {
    userInfo();
  }, []);

  const isDarkMode = useSelector((state: any) => state.visual.isDarkMode);
  if (isDarkMode) {
    return <Fragment>
      <header className='dark'>
        <Navbar></Navbar>
      </header>
      <main className={`${styles.main} dark`}>
        <Router></Router>
      </main>
    </Fragment>
  } //else 
  return <Fragment>
    <header>
      <Navbar></Navbar>
    </header>
    <main className={styles.main}>
      <Router></Router>
    </main>
    <footer></footer>
  </Fragment>
}