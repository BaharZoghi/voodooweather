import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from 'semantic-ui-react';
import _ from 'lodash'
import Script from 'react-load-script'
import {
  Search,
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Dropdown, 
  Input
} from 'semantic-ui-react'


const weatherLink='https://api.openweathermap.org/data/2.5/weather?lat='
let units='imperial'
const imglink='https://openweathermap.org/img/wn/' 
const apiKey="Your OpenWeatherMap API key"

class App extends Component {

  constructor(props) {
    super(props);
  this.state={
    cityId:'',
    cityName:'Akron',
    searchValue:'',
    initialState : { isLoading: false, results: [], value: '' },
    bigSource:[],
    query:'',
    control:false,
    lat:'41.0814447',
    lng:'-81.51900529999999',
    icon:'',
    description:'',
    humidity:'',
    temp:'',
    wind:'',
    weekday:['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    time:'',
    day:'',
    pmam:''
  }
  

}

componentDidMount(){
  this.searchWeather();
}


handleScriptLoad = () => {

  const options = {
    types: ['(cities)'],
  };
  this.autocomplete = new window.google.maps.places.Autocomplete(
    document.getElementById('autocomplete'),
    options,
  );
  this.autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);
  this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
}


handlePlaceSelect = () => {

  const addressObject = this.autocomplete.getPlace();
  const address = addressObject.address_components;
  if (address) {
    this.setState(
      {
        cityName: address[0].long_name,
        query: addressObject.formatted_address,
        lat:addressObject.geometry.location.lat(),
        lng:addressObject.geometry.location.lng()
      }, ()=>{
        this.searchWeather();
      }
    );
  }
}


  checkKeyCode=(e)=>{
    if (e.nativeEvent.key === 'Enter') {
      this.searchWeather();
    }
  }

  searchWeather = (e) => {

    let tempIcon='';
    let tempWind='';
    let tempHumid='';
    let tempTemp='';
    let tempDescr='';
    let tempTime='';
    let tempDay='';
    let tm;
    let date=new Date();
    if(this.state.lat !== '' && this.state.lng !== ''){
    fetch(weatherLink+`${this.state.lat}&lon=${this.state.lng}&appid=${apiKey}&units=${units}`)
      .then((response) => {
        return response.json()
      })
      .then((json) => {

        tempDay=this.state.weekday[date.getDay()]+', ';
        tm=date.getHours();
        if(tm>12 && tm!=24){
          tempTime= (tm-12) + ' PM, ';
        }else if (tm>12 && tm==24){
          tempTime= (tm-12) +' AM, '
        }else if(tm<12){
          tempTime= tm +' AM, '
        } else{
          tempTime= tm +' PM, '
        }
        this.setState({time:tempTime})
        this.setState({day: tempDay})
        tempIcon=imglink + json.weather[0].icon + '@2x.png';
        this.setState({icon:tempIcon});
        tempDescr = json.weather[0].main
        tempDescr = tempDescr[0].toUpperCase() + tempDescr.substr(1);
        this.setState({description:tempDescr});
        tempWind = 'Wind: ' + Math.floor(json.wind.speed)+' mph';
        this.setState({wind:tempWind});
        tempHumid = 'Humidity: ' + Math.floor(json.main.humidity)+'%';
        this.setState({humidity:tempHumid});
        tempTemp=Math.floor(json.main.temp);
        this.setState({temp:tempTemp})
        let citycountry=this.state.cityName + ', '+ json.sys.country ;
        this.setState({cityName:citycountry})
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  render() {

    return (
      <div className="App">

        <Script
          url="https://maps.googleapis.com/maps/api/js?key=${YourGoogle-Place-API-Key}&libraries=places"
          onLoad={this.handleScriptLoad.bind(this)}
        />
        <Container className='contolAll'>
        <Segment basic textAlign='center'>
        <Segment color='yellow' className='weatherContainer'>
          <Container className='controlImage'><Image src={this.state.icon} centered circular/></Container>
          <Container className='controlCity'><Header as='h1' className='city'>{this.state.cityName}</Header></Container>
    <Container className='controlDayTime'><Header as='h5' className='daytime'>{this.state.day}{this.state.time}{this.state.description}</Header></Container>
          <Container className='controlTempr'><Header as='h1' className='tempr'>{this.state.temp}<a className='celicDeg'>{'\u2103'}</a></Header></Container>
          <Container className='controlHuminWind'><Segment.Group horizontal>
            <Segment className='humid'>{this.state.humidity}</Segment>
            <Segment className='wind'>{this.state.wind}</Segment>
          </Segment.Group></Container>
        </Segment>
            <Input
                icon='search'
                placeholder='Search...'
                id='autocomplete'
                onKeyPress={this.checkKeyCode.bind(this)}
                onFocus = {(e) => e.target.value = ""} 
            >
            </Input>
            
        </Segment>
        </Container>
      </div>
    );
  }
}

export default App;
