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
      {
        id: 1,
        title: "iPhone 15 Pro Max",
        price: "1259€",
        oldPrice: "1399€",
        company: "Apple",
        image: "/apple-logo.png",
        url: "#"
      },
      {
        id: 2,
        title: "Samsung Galaxy S24 Ultra", 
        price: "999€",
        company: "Samsung",
        image: "/samsung-logo.png",
        url: "#"
      }
    ]
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}