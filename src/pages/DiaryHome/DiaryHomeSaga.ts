import { call, take, cancelled, put, takeEvery, all } from "redux-saga/effects";
import { addCardFailure, addCardSuccess, getCardFailure, getCardSuccess } from "./DiaryHomeSlice";
// Add a second document with a generated ID.
import {
  addDoc,
  collection,
  getDocs,
  query,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../Firebase";
import { EventChannel, eventChannel } from "redux-saga";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
interface cardData {
  name: string;
  title: string;
  description: string;
}

const getCards = async () => {

  return eventChannel(emitter => {
    const q = query(collection(db, "Card"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        var temp: cardData[];
        temp = [];
        querySnapshot.forEach((doc) => {
          const name = doc.data().name;
          const title = doc.data().title;
          const description = doc.data().description;                  
    
          temp.push({ name, title, description });
        });
        emitter(temp)
    });
    return unsubscribe;
    }
)


  // try {
  //   const querySnapshot = await getDocs(collection(db, "Card"));
  //   var temp: cardData[];
  //   temp = [];
  //   querySnapshot.forEach((doc) => {
  //    // console.log(`${doc.id} => ${doc.data().name}`);
      // const name = doc.data().name;
      // const title = doc.data().title;
      // const description = doc.data().description;

      // temp.push({ name, title, description });
  //   });
  //   return temp;
  //   //  distpatch(getMsgSuccess(temp));
  // } catch (e) {
  //   console.error("Error adding document: ", e);
  //   return e;
  // }

}
    // const readData = async() =>{
    //   var cardContent = [] as any;
    //     const querySnapshot = await getDocs(collection(db, "Card"));
    //     querySnapshot.forEach((doc) => {
    //     const title = doc.data().title;
    //     const description = doc.data().description;
    //     const name = doc.data().name;
    //     cardContent.push({title, description, name});
    //     });
    //     // dispatch(getCardSuccess(cardContent));
    // } 

const postNewCard = async (newCard: {
  name: any;
  title: any;
  description: any;
}) => {
  try {
  
    const docRef = await addDoc(collection(db, "Card"), {
      name: newCard.name,
      title: newCard.title,
      description: newCard.description,
    });
    console.log("Document written with ID: ", docRef.id);
  
    const returnCard = { Id: docRef.id, ...newCard };
    return returnCard;
  } catch (error) {
    console.log(error);
    return error;
  }
};

function* fetchCards(): any {
  const chan: EventChannel<cardData[]> = yield call(getCards);
  try {
    while(true){
      let crds: cardData[] = yield take(chan);
      yield put(getCardSuccess(crds));
    }
    // const crds = yield getCards();
    // yield put(getCardSuccess(crds));
  } finally {
    let val: boolean = yield cancelled()
    if(val){
        chan.close()
       }
    // yield put(getCardFailure());
  }
}
//addMsgSucces
function* addNewCardSaga(action: any): any {
  try {
    const crd = yield postNewCard(action.payload);
    yield put(addCardSuccess(crd));
  } catch (e) {
    yield put(addCardFailure());
  }
}
/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
function* cardSaga() {
  yield takeEvery("card/getCardStart", fetchCards);
}
// eslint-disable-next-line require-yield
function* NewCard() {
  yield takeEvery("card/addCardStart", addNewCardSaga);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([cardSaga(), NewCard()]);
}
