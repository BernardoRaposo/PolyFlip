// Load environment variables FIRST
require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const Card = require("../models/Card.js").default;
const dbConnect = require("../lib/mongo.js").default;



async function seed() {
    await dbConnect();

  const flashcards = [
    // 🇩🇪 GERMAN
    { language: "German", front: "Hallo", back: "Hello" },
    { language: "German", front: "Danke", back: "Thank you" },
    { language: "German", front: "Bitte", back: "Please / You're welcome" },
    { language: "German", front: "Tschüss", back: "Bye" },
    { language: "German", front: "Guten Morgen", back: "Good morning" },
    { language: "German", front: "Guten Abend", back: "Good evening" },
    { language: "German", front: "Entschuldigung", back: "Sorry / Excuse me" },
    { language: "German", front: "Ja", back: "Yes" },
    { language: "German", front: "Nein", back: "No" },
    { language: "German", front: "Wie geht’s?", back: "How are you?" },
    { language: "German", front: "Ich verstehe nicht", back: "I don't understand" },
    { language: "German", front: "Wasser", back: "Water" },
    { language: "German", front: "Essen", back: "Food" },
    { language: "German", front: "Freund", back: "Friend" },
    { language: "German", front: "Hilfe", back: "Help" },

    // 🇵🇹 PORTUGUESE
    { language: "Portuguese", front: "Olá", back: "Hello" },
    { language: "Portuguese", front: "Obrigado/Obrigada", back: "Thank you" },
    { language: "Portuguese", front: "Por favor", back: "Please" },
    { language: "Portuguese", front: "Adeus", back: "Goodbye" },
    { language: "Portuguese", front: "Bom dia", back: "Good morning" },
    { language: "Portuguese", front: "Boa tarde", back: "Good afternoon" },
    { language: "Portuguese", front: "Boa noite", back: "Good night" },
    { language: "Portuguese", front: "Desculpa", back: "Sorry" },
    { language: "Portuguese", front: "Sim", back: "Yes" },
    { language: "Portuguese", front: "Não", back: "No" },
    { language: "Portuguese", front: "Água", back: "Water" },
    { language: "Portuguese", front: "Comida", back: "Food" },
    { language: "Portuguese", front: "Amigo", back: "Friend" },
    { language: "Portuguese", front: "Casa", back: "House" },
    { language: "Portuguese", front: "Aprender", back: "Learn" },

    // 🇬🇧 ENGLISH
    { language: "English", front: "Hello", back: "Olá" },
    { language: "English", front: "Thank you", back: "Obrigado / Obrigada" },
    { language: "English", front: "Please", back: "Por favor" },
    { language: "English", front: "Goodbye", back: "Adeus" },
    { language: "English", front: "Good morning", back: "Bom dia" },
    { language: "English", front: "Good night", back: "Boa noite" },
    { language: "English", front: "Sorry", back: "Desculpa" },
    { language: "English", front: "Yes", back: "Sim" },
    { language: "English", front: "No", back: "Não" },
    { language: "English", front: "Water", back: "Água" },
    { language: "English", front: "Food", back: "Comida" },
    { language: "English", front: "House", back: "Casa" },
    { language: "English", front: "Friend", back: "Amigo" },
    { language: "English", front: "Help", back: "Ajuda" },
    { language: "English", front: "Learn", back: "Aprender" },
  ];

  await Card.deleteMany({});
  await Card.insertMany(flashcards);

  console.log("Flashcards inserted successfully!");
  mongoose.connection.close();
}

seed();
