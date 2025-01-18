'use client';

import React, { useState } from 'react';
import styles from '@/app/styles/navbar.module.scss';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from '@/lib/anim';
import Link from '@/components/layout/nav/Link';
import Curve from '@/components/layout/nav/Curve';

const navItems = [
  {
    title: 'DashBoard',
    href: '/dashboard',
  },
  {
    title: 'Mission',
    href: '/missions',
  },
  {
    title: 'Tasks',
    href: '/tasks',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.body}>
        <nav
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={styles.nav}
        >
          <div className={styles.header}>
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => (
            <Link
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === data.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}
        </nav>
      </div>
      <Curve />
    </motion.div>
  );
}
