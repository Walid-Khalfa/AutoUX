import { motion } from 'framer-motion';

// KIRO-AI: UX Score Gauge component with circular progress indicator
// Displays score 0-100 with color-coded ranges and emoji indicators
// Uses Framer Motion for gauge animation (1.5s ease-out)
// Green (90-100): Excellent, Orange (70-89): Fair, Red (<70): Critical

function UXScoreGauge({ score = 75 }) {
  const getScoreData = (score) => {
    if (score >= 90) {
      return {
        color: '#10b981',
        emoji: '🟢',
        label: 'Excellent',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      };
    }
    if (score >= 70) {
      return {
        color: '#f59e0b',
        emoji: '🟠',
        label: 'Fair',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      };
    }
    return {
      color: '#ef4444',
      emoji: '🔴',
      label: 'Critical',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    };
  };

  const { color, emoji, label, gradient } = getScoreData(score);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '24px',
      }}
    >
      {/* KIRO-AI: Circular gauge with Framer Motion animation */}
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <svg
          width="160"
          height="160"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="14"
          />
          {/* Progress circle with Framer Motion animation */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
              delay: 0.2,
            }}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))',
            }}
          />
        </svg>

        {/* KIRO-AI: Center content - Score only inside circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              fontWeight: '800',
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
            }}
          >
            {score}
          </div>
        </motion.div>
      </div>

      {/* KIRO-AI: "/ 100" text below the circle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
        style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          fontWeight: '500',
          marginTop: '-10px',
          marginBottom: '8px',
        }}
      >
        / 100
      </motion.div>

      {/* KIRO-AI: Label with emoji and status - animated */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          style={{
            fontSize: '2.5em',
            marginBottom: '8px',
          }}
        >
          {emoji}
        </motion.div>
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '4px',
          }}
        >
          UX Score
        </div>
      </motion.div>
    </div>
  );
}

export default UXScoreGauge;
