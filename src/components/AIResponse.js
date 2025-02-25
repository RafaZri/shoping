/**
 * AIResponse Component
 * 
 * This component is responsible for displaying the AI's response to user queries.
 * It includes a heading ("Recommended Products") and dynamically renders the AI's answer.
 * 
 * Props:
 * - answer (string): The AI-generated response to be displayed.
 */

import { useEffect, useRef } from 'react';
import styles from './AIResponse.module.css'; // Import CSS module for component-specific styling
import { useSearch } from '../contexts/SearchContext';

// AIResponse Component: Displays the AI's response and a heading for recommended products
export default function AIResponse({ answer }) {
  const { 
    messages, 
    setSearchData 
  } = useSearch();

  return (
    <div className="overflow-hidden px-6 md:px-16 lg:px-32 mb-16 relative w-full">
      {/* Container for the AI's response */}
      <div className=" md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full">
        {/* Heading for the recommended products section */}
        <h2 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">Recommended Products</h2> <div  className={styles.userBubble}>
                      {messages.content}
                    </div>
        {/* Display the AI's response (answer) */}
        {answer}
      </div>
    </div>
  );
}