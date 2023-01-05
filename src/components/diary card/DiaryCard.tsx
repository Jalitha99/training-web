import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import {Box} from '@mui/material';
import { useState } from 'react';

interface MyProps {
    title: string;
    description: string;
}

const DiaryCard = (props : MyProps) => {
    const title = props.title;
    const description = props.description;
    const [showMore, setShowMore] = useState(false);
    return ( 
    
        <Box width={'300px'}>
    <Card sx={{ minWidth: 100 , maxWidth:300, display:'flex', flexDirection:'column',
         margin:'1%', bgcolor:'#ADD8E6', borderRadius:'5%', boxShadow:'0'}}>

      <CardContent sx={{display:'flex', flexDirection:'column', maxWidth:300}}>
        <Typography sx={{ fontSize: 24 }} variant="subtitle1" color="black" gutterBottom>
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Name
        </Typography>
        <Typography variant="body2" gutterBottom={true}>
          {showMore ? description : description.substring(0, 100)}
        </Typography>
      </CardContent>
      <CardActions>
      <Button variant="outlined" onClick={() => setShowMore(!showMore)}>{!showMore ? "Show More" : "Hide"}</Button>
      </CardActions>
    
    </Card>
    </Box>
       
     );
}
 
export default DiaryCard;