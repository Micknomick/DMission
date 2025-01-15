import Link from "next/link";
import { motion } from "framer-motion";
import { slide, scale } from "@/lib/anim";
import styles from '@/app/styles/link.module.scss';

// データ型定義
type Data = {
  title: string;
  href: string;
  index: number;
};

// コンポーネントの Props 型定義
interface IndexProps {
  data: Data;
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
}

export default function Index({ data, isActive, setSelectedIndicator }: IndexProps) {
  const { title, href, index } = data;

  return (
    <motion.div className={styles.link} onMouseEnter={() => {setSelectedIndicator(href)}} custom={index} variants={slide} initial="initial" animate="enter" exit="exit">
      <motion.div variants={scale} animate={isActive ? "open" : "closed"} className={styles.indicator}></motion.div>
      <Link href={href}>{title}</Link>
    </motion.div>
  );
}
