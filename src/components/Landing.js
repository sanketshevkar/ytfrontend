import { GoogleLogin, GoogleLogout } from 'react-google-login';
import React, { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import PropTypes from 'prop-types';
import Logo from '../assets/YouTube.png';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

function Landing() {

  const [log, setLog] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [playlists, setPlaylists] = useState([])
  const [userInfo, setUserInfo]=useState({})
  const [accessToken, setAccessToken]=useState("")

  /*const playlistData = new Promise((resolve, reject) => {
    if(somethingSuccesfulHappend) {
       resolve()
    } else {
       reject();
    }
 });*/

  const loginSuccess = async(response) => {
    console.log(response);
    setLog(true)
    const res=await jwt_decode(response.tokenId)
    setUsername(res.name)
    setEmail(res.email)
    setAccessToken(response.accessToken)
    console.log(res)
    axios.get(`http://localhost:5000/login`, {headers:{accessToken: response.accessToken, email: res.email, name: res.name}})
      .then(res => {
        console.log(res.data)
        const persons = (res.data.userInfo);
        console.log(persons)
        setUserInfo(persons)
        persons.playlists.map((r)=>(
            setPlaylists(playlists=>[...playlists,r])
        ))
        console.log(playlists)
      })
    /*axios.get(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=AIzaSyCTTLu3QB2FCFwXdT_7wSR95AZJsPpRbZw`, {headers:{Authorization: `Bearer ${response.accessToken}`, Accept: 'application/json'}})
      .then(res => {
        const persons = res.data;
        persons.items.map((r)=>(
            setPlaylists(playlists=>[...playlists,r])
        ))
        console.log(playlists)
      })*/
  }

  const loginFailure = (response) => {
    console.log(response);
  }

  const logout = (response) => {
      setLog(false)
      setPlaylists([])
      setAccessToken({})
  }

  if(log===false){
    return (
        <div style={{marginTop:"5rem"}}>
          <Grid container spacing={3}>
        <Grid item xs={12}>
        <div className="App">
        <div class="container">
<img alt='' src={Logo} />
</div>
</div>
        </Grid>
        <Grid item xs={12}>
          <div className="App">
        <GoogleLogin
        clientId="411815053781-nm9gjh0s5afu2mchlsuj3277uhq9nn88.apps.googleusercontent.com"
        onSuccess={loginSuccess}
        onFailure={loginFailure}
        cookiePolicy={'single_host_origin'}
      />
      </div>
        </Grid>
        </Grid>
        </div>
      );
  }else{
      return(
        <Paper elevation={3} >
          <div style={{padding: "1rem"}}>
            <Paper elevation={2} style={{margin:"1rem", padding: "5px"}}>
          <div style={{fontFamily: 'Montserrat'}}>
              Username: {username}
          </div>
          <div style={{fontFamily: 'Montserrat', marginTop:"2px"}}>
          Email {email}
      </div>
      </Paper>
      
{(playlists === {}) ? "No Vids" :<div> <div>{playlists.map((r)=>(<Router><Paper style={{margin:"0.5rem", padding: "5px"}}><Link to={`/${r.playlistId}`} key={r.playlistId}><div style={{fontFamily: 'Montserrat'}}>{r.title.toUpperCase()}</div></Link></Paper><Switch>
          <Route path="/:id" children={<PlaylistItem userInfo={userInfo} token={accessToken}/>} />
        </Switch></Router>))}</div></div>}
      <GoogleLogout
      clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
      buttonText="Logout"
      onLogoutSuccess={logout}
    >
    </GoogleLogout>
      </div>
      </Paper>
      )
  }
}

function PlaylistItem(props){
    let { id } = useParams();
    const [playlistItems, setPlaylistItems] = useState([])

    useEffect(() => {
        let obj = props.userInfo.playlists.find(o => o.playlistId === id)
        obj.items.map((r)=>(
            setPlaylistItems(playlistItems=>[...playlistItems,r])
        ))});

    const handleDeleted=()=>{
        axios.get(`http://localhost:5000/check`, {headers:{accessToken: props.token, email: props.userInfo.email, playlistId: id}})
        .then(res => {
          const persons = res.data
          console.log(persons)
          alert(persons.deletedVid)
        })
    }

        return(
          <Paper style={{margin:"0.5rem", padding: "5px"}}>
            <div>
                <button onClick={handleDeleted}>Check</button>
        <div>{playlistItems.map((r)=>(<div><Link to={`/${r.id}`} key={r.id}><div style={{fontFamily: 'Montserrat', padding: '3px'}}>{r.snippet.title}{"  "}{r.status.privacyStatus}</div></Link></div>))}</div>
            </div>
            </Paper>
        )
};

PlaylistItem.propTypes = {
   userInfo : PropTypes.object.isRequired,
   token : PropTypes.string.isRequired
  };

export default Landing;