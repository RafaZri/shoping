# Shopping Application

Une application de recherche de produits avec IA intégrée.

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd shoping-main
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'API OpenAI (optionnel mais recommandé)**

Pour une expérience complète avec l'IA, vous devez configurer la clé API OpenAI :

- Allez sur [https://platform.openai.com/](https://platform.openai.com/)
- Créez un compte
- Générez une clé API
- Créez un fichier `.env.local` à la racine du projet :

```env
OPENAI_API_KEY=votre_cle_api_openai_ici
```

4. **Lancer l'application**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## ✨ Fonctionnalités

- 🔍 **Recherche de produits** : Recherche sur Amazon et Nike
- 🤖 **Analyse IA** : Analyse détaillée des produits avec OpenAI GPT-5
- 🌐 **Support multilingue** : Français et Anglais
- 📱 **Interface responsive** : Compatible mobile et desktop
- ⚡ **Performance optimisée** : Scraping rapide et efficace

## 🔧 Configuration

### Sans clé API OpenAI
L'application fonctionne sans la clé API OpenAI, mais avec des fonctionnalités limitées :
- Recherche de produits ✅
- Affichage des résultats ✅
- Analyse IA basique ✅
- Analyse IA avancée ❌

### Avec clé API OpenAI
Avec la clé API configurée, vous obtenez :
- Analyse IA complète des produits avec GPT-5
- Recommandations personnalisées
- Comparaisons détaillées
- Explications techniques avancées

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14, React 18, Tailwind CSS
- **IA** : OpenAI API (GPT-5)
- **Scraping** : Puppeteer, Cheerio
- **Styling** : CSS Modules, Tailwind CSS

## 📝 Notes

- L'application utilise des scrapers pour récupérer les données des sites e-commerce
- Les résultats peuvent varier selon la disponibilité des sites
- La clé API OpenAI nécessite un compte et peut avoir des coûts selon l'utilisation

## 🐛 Dépannage

Si vous rencontrez l'erreur "Failed to fetch" :
1. Vérifiez que le serveur est en cours d'exécution
2. Assurez-vous que les scrapers fonctionnent correctement
3. Vérifiez la configuration de votre clé API OpenAI (si utilisée)

## 📄 Licence

Ce projet est sous licence MIT. 