import { motion } from 'framer-motion'

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
}

export default function PageWrapper({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}
