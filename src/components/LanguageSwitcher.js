'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    // Toggle between English and French
    changeLanguage(currentLanguage === 'en' ? 'fr' : 'en');
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.languageIconButton}
        onClick={handleLanguageToggle}
      >
        <span className={styles.languageIndicator}>
          {currentLanguage === 'en' ? 'FR' : 'EN'}
        </span>
        <span className={styles.languageTooltip}>
          {currentLanguage === 'en' 
            ? getTranslation('switchToFrench', currentLanguage) 
            : getTranslation('switchToEnglish', currentLanguage)
          }
        </span>
      </button>
    </div>
  );
} 