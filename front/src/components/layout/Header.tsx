'use client';

import styles from '@/app/styles/header.module.scss';
import { useEffect, useState } from 'react';
import NavBar from '@/components/layout/nav/NavBar';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  // NavBar の状態を切り替える関数
  const toggleNavBar = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    // パスが変わったら NavBar を閉じる
    setIsActive(false);
  }, [pathname]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <div onClick={toggleNavBar} className={styles.button}>
            <div className={`${styles.burger} ${isActive ? styles.burgerActive : ''}`}></div>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isActive && <NavBar />}
      </AnimatePresence>
    </>
  );
}
