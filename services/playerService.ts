
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  writeBatch,
  doc,
  updateDoc,
  deleteDoc,
  where
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { MOCK_PLAYERS } from "../constants";

export const uploadPlayerFile = async (file: File, path: string): Promise<string> => {
  const fileRef = ref(storage, `players/${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  return await getDownloadURL(snapshot.ref);
};

export const syncGlobalState = async () => {
  const playersRef = collection(db, "players");
  const snapshot = await getDocs(playersRef);
  return snapshot.size;
};

// وظيفة حفظ سجل الحضور اليومي
export const saveAttendanceRecord = async (date: string, team: string, records: any) => {
  const attendanceRef = collection(db, "attendance_logs");
  const docRef = await addDoc(attendanceRef, {
    date,
    team,
    records,
    createdAt: Timestamp.now(),
    approvedBy: "Admin/Coach"
  });
  return docRef.id;
};

export const approvePlayerRequest = async (playerId: string) => {
  const playerDoc = doc(db, "players", playerId);
  await updateDoc(playerDoc, { 
    status: 'active',
    attendanceRate: 100,
    lastUpdated: Timestamp.now()
  });
};

export const markAsPaid = async (playerId: string) => {
  const playerDoc = doc(db, "players", playerId);
  await updateDoc(playerDoc, { 
    paymentStatus: 'paid',
    lastUpdated: Timestamp.now()
  });
};

export const updatePlayerTeam = async (playerId: string, teamName: string) => {
  const playerDoc = doc(db, "players", playerId);
  await updateDoc(playerDoc, { 
    team: teamName,
    lastUpdated: Timestamp.now()
  });
};

export const registerNewPlayer = async (playerData: any, idPhoto?: File, personalPhoto?: File, initialStatus: 'active' | 'pending' = 'pending', initialPayment: 'paid' | 'unpaid' = 'unpaid') => {
  try {
    let idPhotoUrl = "";
    let personalPhotoUrl = "";

    if (idPhoto) idPhotoUrl = await uploadPlayerFile(idPhoto, "id_photos");
    if (personalPhoto) personalPhotoUrl = await uploadPlayerFile(personalPhoto, "avatars");

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const suggestedUsername = (playerData.fullName || "user").split(' ')[0] + randomSuffix;

    const docRef = await addDoc(collection(db, "players"), {
      ...playerData,
      idPhotoUrl,
      personalPhotoUrl,
      createdAt: Timestamp.now(),
      attendanceRate: initialStatus === 'active' ? 100 : 0, 
      status: initialStatus,
      paymentStatus: initialPayment,
      username: suggestedUsername,
      password: "" 
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding player: ", error);
    throw error;
  }
};

export const updatePlayerProfile = async (playerId: string, updates: any) => {
  const playerDoc = doc(db, "players", playerId);
  await updateDoc(playerDoc, { 
    ...updates,
    lastUpdated: Timestamp.now()
  });
};

export const deletePlayer = async (playerId: string) => {
  const playerDoc = doc(db, "players", playerId);
  await deleteDoc(playerDoc);
};

export const subscribeToPlayers = (callback: (players: any[]) => void) => {
  const q = query(collection(db, "players"));
  return onSnapshot(q, (snapshot) => {
    const players = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(players);
  });
};

export const sendApprovalNotification = async (phone: string, playerName: string) => {
  console.log(`Notification for ${playerName} sent to ${phone}`);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const seedInitialData = async () => {
  const snapshot = await getDocs(collection(db, "players"));
  if (snapshot.empty) {
    const batch = writeBatch(db);
    MOCK_PLAYERS.forEach((player) => {
      const newDocRef = doc(collection(db, "players"));
      batch.set(newDocRef, {
        fullName: player.name,
        name: player.name,
        ageGroup: player.ageGroup,
        level: player.level,
        team: player.team,
        status: player.status,
        paymentStatus: 'paid', 
        attendanceRate: player.attendanceRate,
        createdAt: Timestamp.now(),
        username: player.name.split(' ')[0] + Math.floor(Math.random()*99),
        password: "123"
      });
    });
    await batch.commit();
  }
};
