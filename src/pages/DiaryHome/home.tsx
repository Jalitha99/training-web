import DiaryCard from "../../components/diary card/DiaryCard";
import Navbar from "../../components/Navbar/Navbar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useEffect, useState } from 'react';
import { CardContent, Collapse } from '@mui/material';
import {db} from "../../Firebase"
import { addDoc, collection, doc, getDocs } from "firebase/firestore"; 
import { useCallback } from 'react'
import { margin, padding } from "@mui/system/spacing";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCardStart, getCardStart, getCardSuccess } from "./DiaryHomeSlice";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SearchAppBar from "../../components/Navbar/Navbar";


interface MyProps {
  [x: string]: any;
  title: string;
  description: string;
  name: string;
}

const Home = () => {
    const [title, setSubmitNew] = useState('');
    const [description, setDescription] = useState('');
    const [collapseValue, setCollapse] = useState(false)
    // const [cardContent, setCardContent] = useState([]);
    const params = useParams();
    const userName = params.userName;
    const dispatch = useDispatch(); 
    const handle = useFullScreenHandle();

    // const readData = async() =>{
    //   var cardContent = [] as any;
    //     const querySnapshot = await getDocs(collection(db, "Card"));
    //     querySnapshot.forEach((doc) => {
    //     const title = doc.data().title;
    //     const description = doc.data().description;
    //     const name = doc.data().name;
    //     cardContent.push({title, description, name});
    //     });
    //     setCardContent(cardContent);
    //     dispatch(getCardSuccess(cardContent));
    // }    

    useEffect(() => {
      console.log('line 50 use effect')
        dispatch(getCardStart());
      }, [dispatch]);

      // useEffect(() => {
      //   readData();
      // }, [isRender]);

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        // Add a new document in collection "Card"
        // try {
        //     if(title || description){
        //       const docRef = await addDoc(collection(db, "Card"), {
                // description : description,
                // name : userName,
                // title : title
        //       });
        //       console.log("Document written with ID: ", docRef.id);
        //     }else{
        //       console.log('plz provide a title or description')
        //     }
        //   } catch (e) {
        //     console.error("Error adding document: ", e);
        //   }
        dispatch(addCardStart({
          description : description,
          name : userName,
          title : title
        }))
  
        setSubmitNew('');
        setDescription('');
    }

    const cardContentRedux = useSelector((state: MyProps) => state.card.cards);

    return ( 
        <> 
        <SearchAppBar />
        <form onSubmit={handleSubmit}>
        <Box sx={{ flexGrow: 2, display:'flex' }}>
            
            <Grid container spacing={2}>
                <Grid item xs={10} >

                <TextField 
                sx={{
                  paddingBottom: "0",
                  '& label': { paddingLeft: (theme) => theme.spacing(2) },
                  '& input': { paddingLeft: (theme) => theme.spacing(3.5) },
                  '& fieldset': {
                    
                    borderRadius: '30px',
                    border: 'none',
                    backgroundColor: '#F0f8FF',
                    width: '100%',
                    marginRight: '2vw',
                    input:{color: 'black'}
                  },
                }}
  
                style={{width:'100%', margin:'1%'}} id="outlined-basic"
                label="Submit New" value={title}
                onChange={(e) => setSubmitNew(e.target.value)}
                onFocus={ e => setCollapse(true)} 
                onBlur={e => setCollapse(false)}
                />
                </Grid>
                <Grid item xs={2}>

                <Button
                type="submit" 
                style={{
                    width:"70%",
                    height:"55%",
                    margin:'1vw 0 0vw 2vw',
                    borderRadius: 20,
                    }} variant="contained">Submit
                </Button>

                </Grid>
                

                <Grid item xs={12}>
                <Collapse in={collapseValue || (!!title || !!description)}>
                    <TextareaAutosize
                    onFocus={ e => setCollapse(true)} 
                    onBlur={e => setCollapse(false)}
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    aria-label="minimum height"
                    minRows={10}
                    placeholder="Enter Description"
                    style={{ width:'95%', margin:'1%',border:'none', borderRadius: 20,
                                backgroundColor: '#f2f2f2',opacity:'0.7', padding:'1vw',fontSize:'1.2vw' }}
                    />
                </Collapse>
                </Grid>
                
            </Grid>
        
            
        </Box>
        </form>
      
        <Grid container spacing={2} sx={{marginLeft:'0.5vw'}}>
          {cardContentRedux.map((m: { [x: string]: string; }) => {
            return (
              <Grid item xs={12} md={3} >
                <DiaryCard title={m['title']} name = {m['name']} description={m['description']}/>
              </Grid>
            )
          })}
        </Grid>
        </>
     );
}
 
export default Home;