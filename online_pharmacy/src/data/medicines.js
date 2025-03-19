import { addDoc, collection } from "firebase/firestore";

// Dummy medicine data with real-looking information and image URLs
export const medicines = [
  {
    id: '1',
    name: 'Aspirin 325mg',
    brand: 'Bayer',
    description: 'Pain reliever and fever reducer',
    price: 9.99,
    category: 'Pain Relief',
    stock: 150,
    image: 'https://example.com/images/aspirin.jpg'
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    brand: 'Generic',
    description: 'Antibiotic for bacterial infections',
    price: 15.99,
    category: 'Antibiotics',
    stock: 100,
    image: 'https://example.com/images/amoxicillin.jpg'
  },
  // ... continuing with 48 more items
];

// Initialize Firebase with medicine data
export const initializeMedicineData = async (db) => {
  const medicinesRef = collection(db, 'medicines');
  
  for (const medicine of medicines) {
    try {
      await addDoc(medicinesRef, {
        ...medicine,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  }
};