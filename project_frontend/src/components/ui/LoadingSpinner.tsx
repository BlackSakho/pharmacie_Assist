import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner = ({ className = '' }: LoadingSpinnerProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-primary-200 border-t-primary-600"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <span className="sr-only">Chargement...</span>
    </div>
  );
};

export default LoadingSpinner;