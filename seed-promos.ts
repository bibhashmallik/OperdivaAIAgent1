import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

async function seed() {
  console.log("Seeding promos...");
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    
    const promos = [
      { code: "OFF100", discount: 100 },
      { code: "FREE", discount: 100 },
      { code: "ADWP100", discount: 100 },
      { code: "BONUS100", discount: 100 },
      { code: "DIVA50", discount: 50 },
      { code: "LITE10", discount: 10 }
    ];

    for (const p of promos) {
        const q = query(collection(db, "promos"), where("code", "==", p.code));
        const snap = await getDocs(q);
        if (snap.empty) {
            await addDoc(collection(db, "promos"), p);
            console.log(`Added promo: ${p.code}`);
        } else {
            console.log(`Promo ${p.code} already exists.`);
        }
    }
    console.log("Seeding complete.");
    process.exit(0);
  } catch (err: any) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
}
seed();
