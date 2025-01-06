/**
 * AIResponse Component
 * 
 * This component is responsible for displaying the AI's response to user queries.
 * It includes a heading ("Recommended Products") and dynamically renders the AI's answer.
 * 
 * Props:
 * - answer (string): The AI-generated response to be displayed.
 */

import styles from './AIResponse.module.css'; // Import CSS module for component-specific styling

// AIResponse Component: Displays the AI's response and a heading for recommended products
export default function AIResponse({ answer }) {
  return (
    <div className={styles.aiResponse}>
      {/* Container for the AI's response */}
      <div className={styles.answer}>
        {/* Heading for the recommended products section */}
        <h2>Recommended Products</h2>
        {/* Display the AI's response (answer) */}
        {answer}
      </div>
    </div>
  );
}