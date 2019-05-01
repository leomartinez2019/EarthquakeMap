import React from 'react';

class Earthquakes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marcadores: [],
      filtro: 'mag'
    }
   this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    //fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson")
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson")
    //fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson")
      .then(response => response.json())
      .then(data => {
          
          var listado = data.features.map(dato => {
            var coordinates = dato['geometry']['coordinates'];
            var magnitude = dato['properties']['mag'];
            var place = dato['properties']['place'];
            var time = dato['properties']['time'];

            return {
                     lat: coordinates[1],
                     lng: coordinates[0],
                     mag: magnitude,
                     place: place,
                     time: new Date(time)
                   }
          });

          //** Esta parte fue clave para actualizar el mapa
          //** usar el callback de setState en vez de componentDidMount
          //this.setState({marcadores: listado});
          this.setState({marcadores: listado}, this.renderMap());
          //console.log(listado);
        }
      );
  }


  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=<apikey>&callback=initMap");
    window.initMap = this.initMap;
  }

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 19.9, lng: 155.58},
      zoom: 2,
      mapTypeId: 'terrain'
    });
    // Set markers in the map
    
    this.state.marcadores.map(function(obj) {
      return new window.google.maps.Marker({
        position: {lat: obj.lat, lng: obj.lng},
        map: map,
        title: obj.place + ' ' + obj.mag + ' ' + obj.time
      });
    });
    
  }


  handleChange(event) {
    this.setState({filtro: event.target.value});
  }


  render() {
    const filtro = this.state.filtro;
    // Clone state so that there is no mutation:
    const objetos = [...this.state.marcadores];
    objetos.sort(function(a, b) {
      return filtro === 'mag' ? b.mag - a.mag : b.time - a.time;
    });
    const encabezado = filtro === 'mag' ? 'magnitud' : 'más reciente';
    return (
      <div className="earthquake">
        <h1>Mapa de Terremotos</h1>
        <div className="map-info">
          <div id="map"></div>
          <div className="mag-info">
            <h2>Eventos ordenados por {encabezado}</h2>

            <form>
              Ordenar por:
              <div className="radio">
              <label>
                <input type="radio" value="mag" onChange={this.handleChange} checked={filtro === 'mag'} />
                Magnitud
              </label>
              </div>
              <div className="radio">
              <label>
                <input type="radio" value="fecha" onChange={this.handleChange} checked={filtro  === 'fecha'}/>
                Más reciente
              </label>
          </div>
        </form>


            {
              objetos.map((dato, index) => (
                <div key={index} className="info-detalle">
                  <p>{dato.place}. <span id="magnitud">Magnitud: {dato.mag}</span></p>
                  <p>{dato.time.toGMTString()}</p>
                </div>
              ))
            }
          </div>
        </div> 
      </div>
    )
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName('script')[0];
  var script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default Earthquakes;
