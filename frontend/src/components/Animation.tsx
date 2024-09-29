import { useState } from "react";
import { motion } from "framer-motion";

// Type definition for the component props (if needed)
type animationType = "like" | "dislike" | "text";

export interface LiveAnimationsProps {
  userName: string;
  animationType: animationType;
  withText?: boolean;
  text?: string;
  startAnimation: boolean;
  setAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}

const LiveAnimations: React.FC<LiveAnimationsProps> = ({
  userName,
  animationType,
  withText = true,
  text,
  startAnimation,
  setAnimation,
}) => {
  const max_width = animationType == "text" ? 50 : 200;
  const getRandomX = (): number => Math.floor(Math.random() * max_width); // Random X position

  const handleAnimationComplete = () => {
    setAnimation(false); // Change the state when animation is complete
  };
  return (
    <div
      style={{
        border: "red 2px solid",
        position: "relative",
        width: "300px",
        height: "300px",
        overflow: "hidden",
      }}
    >
      {startAnimation && (
        <motion.div
          initial={{ y: 50, x: getRandomX(), opacity: 1 }} // Starts from the bottom
          animate={{ y: -300, opacity: 0, zIndex: 99999 }} // Moves to the top and fades out
          transition={{ duration: 12.5, ease: "easeOut" }} // Slow transition upward
          style={{ position: "absolute", bottom: "0" }}
          onAnimationComplete={handleAnimationComplete}
        >
          {animationType == "like" && (
            <p
              style={{
                maxWidth: "120",
                wordBreak: "break-word",
                border: "pink 1px solid",
                color: "black",
                fontSize: "1.5rem",
              }}
            >
              {withText ? userName : ""} 👍
            </p>
          )}
          {animationType == "dislike" && <p>{withText ? userName : ""} 👎</p>}
          {animationType == "text" && (
            <p>
              {withText ? userName : ""} - {text}{" "}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LiveAnimations;
