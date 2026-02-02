import { collection, query, where, getDocs } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "./firebase.js";

async function checkAvailability(roomType, checkIn, checkOut) {

  const bookingsRef = collection(db, "bookings");

  const q = query(
    bookingsRef,
    where("roomType", "==", roomType),
    where("status", "==", "paid")
  );

  const snapshot = await getDocs(q);

  let bookedCount = 0;

  snapshot.forEach(doc => {
    const booking = doc.data();

    const existingIn = new Date(booking.checkIn);
    const existingOut = new Date(booking.checkOut);

    if (
      existingIn < new Date(checkOut) &&
      existingOut > new Date(checkIn)
    ) {
      bookedCount++;
    }
  });

  return bookedCount;
}


async function isRoomAvailable(roomType, checkIn, checkOut, totalRooms) {

  const booked = await checkAvailability(roomType, checkIn, checkOut);

  if (booked < totalRooms) {
    return true;   // ✅ AVAILABLE
  } else {
    return false;  // ❌ SOLD OUT
  }
}


const available = await isRoomAvailable(
  "twin",
  "2026-02-10",
  "2026-02-13",
  5
);

if (available) {
  alert("Room Available ✅");
} else {
  alert("Sold Out ❌");
}

export { isRoomAvailable };