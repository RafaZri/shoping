// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Assurez-vous que ce nom correspond
// });

// export async function POST(request) {
//   try {
//     const { query } = await request.json();
    
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: query }],
//     });

//     const aiResponse = completion.choices[0].message.content;
    
//     // Ajoutez ici votre logique de produits
//     const products = []; 

//     return new Response(JSON.stringify({ 
//       aiResponse, 
//       products 
//     }), { 
//       status: 200 
//     });

//   } catch (error) {
//     console.error('API Error:', error);
//     return new Response(JSON.stringify({ 
//       error: error.message || 'Erreur de serveur' 
//     }), { 
//       status: error.status || 500 
//     });
//   }
// }

export async function POST(request) {
  // Simulez un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Réponse mockée
  return new Response(JSON.stringify({
    aiResponse: "Voici des résultats simulés :",
    products: [
      { id: 1, title: "Apple iPhone 15 Pro Max", price: "1259$", company: "Apple", image: "/apple-logo.png", url: "#" },
      { id: 2, title: "Samsung Galaxy S24 Ultra", price: "999$", company: "Samsung", image: "/samsung-logo.png", url: "#" },
      { id: 3, title: "Google Pixel 8 Pro", price: "999$", company: "Google", image: "/google-logo.png", url: "#" },
      { id: 4, title: "OnePlus 11", price: "749$", company: "OnePlus", image: "/oneplus-logo.png", url: "#" },
      { id: 5, title: "Xiaomi 13 Pro", price: "899$", company: "Xiaomi", image: "/xiaomi-logo.png", url: "#" },
      { id: 6, title: "Sony Xperia 1 IV", price: "1299$", company: "Sony", image: "/sony-logo.png", url: "#" },
      { id: 7, title: "Huawei P50 Pro", price: "899$", company: "Huawei", image: "/huawei-logo.png", url: "#" },
      { id: 8, title: "Nokia G50", price: "299$", company: "Nokia", image: "/nokia-logo.png", url: "#" },
      { id: 9, title: "LG Velvet", price: "599$", company: "LG", image: "/lg-logo.png", url: "#" },
      { id: 10, title: "Motorola Edge 20", price: "699$", company: "Motorola", image: "/motorola-logo.png", url: "#" },
      { id: 11, title: "Asus Zenfone 8", price: "799$", company: "Asus", image: "/asus-logo.png", url: "#" },
      { id: 12, title: "Oppo Find X3 Pro", price: "1149$", company: "Oppo", image: "/oppo-logo.png", url: "#" },
      { id: 13, title: "Realme GT", price: "499$", company: "Realme", image: "/realme-logo.png", url: "#" },
      { id: 14, title: "Vivo X70 Pro", price: "899$", company: "Vivo", image: "/vivo-logo.png", url: "#" },
      { id: 15, title: "HTC U20 5G", price: "699$", company: "HTC", image: "/htc-logo.png", url: "#" },
      { id: 16, title: "ZTE Axon 20", price: "499$", company: "ZTE", image: "/zte-logo.png", url: "#" },
      { id: 17, title: "BlackBerry Key2", price: "649$", company: "BlackBerry", image: "/blackberry-logo.png", url: "#" },
      { id: 18, title: "Alcatel 1S", price: "199$", company: "Alcatel", image: "/alcatel-logo.png", url: "#" },
      { id: 19, title: "Honor 50", price: "499$", company: "Honor", image: "/honor-logo.png", url: "#" },
      { id: 20, title: "TCL 20 Pro 5G", price: "499$", company: "TCL", image: "/tcl-logo.png", url: "#" },
      { id: 21, title: "Poco F3", price: "349$", company: "Poco", image: "/poco-logo.png", url: "#" },
      { id: 22, title: "Infinix Zero 8", price: "299$", company: "Infinix", image: "/infinix-logo.png", url: "#" },
      { id: 23, title: "Tecno Camon 17", price: "199$", company: "Tecno", image: "/tecno-logo.png", url: "#" },
      { id: 24, title: "Meizu 18", price: "699$", company: "Meizu", image: "/meizu-logo.png", url: "#" },
      { id: 25, title: "Lenovo Legion Phone Duel", price: "999$", company: "Lenovo", image: "/lenovo-logo.png", url: "#" },
      { id: 26, title: "Razer Phone 2", price: "799$", company: "Razer", image: "/razer-logo.png", url: "#" },
      { id: 27, title: "Fairphone 4", price: "599$", company: "Fairphone", image: "/fairphone-logo.png", url: "#" },
      { id: 28, title: "Essential Phone", price: "499$", company: "Essential", image: "/essential-logo.png", url: "#" },
      { id: 29, title: "Microsoft Surface Duo", price: "1399$", company: "Microsoft", image: "/microsoft-logo.png", url: "#" },
      { id: 30, title: "Google Pixel 6a", price: "449$", company: "Google", image: "/google-logo.png", url: "#" }
    ]
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
