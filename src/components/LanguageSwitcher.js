'use client';

import { useLanguage } from '../contexts/LanguageContext';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={`${styles.languageButton} ${currentLanguage === 'en' ? styles.active : ''}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <span className={styles.separator}>|</span>
      <button
        className={`${styles.languageButton} ${currentLanguage === 'fr' ? styles.active : ''}`}
        onClick={() => changeLanguage('fr')}
      >
        FR
      </button>
    </div>
  );
} 