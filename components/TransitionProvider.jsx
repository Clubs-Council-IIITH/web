import { motion } from "framer-motion";

export default function TransitionProvider({ route, children }) {
    return (
        <motion.div
            key={route}
            initial={{ y: 20, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{
                type: "spring",
                stiffness: 160,
                damping: 20,
            }}
        >
            {children}
        </motion.div>
    );
}