// import React, { Component } from 'react';
// // import logo from './logo.svg';
// import './App.css';

// class App extends Component {
//   // Initialize state
//   state = { stops: [] }
// // Fetch passwords after first mount
//   componentDidMount() {
//     this.getPasswords();
//   }

//   getPasswords = () => {
//     // Get the passwords and store them in state
//     fetch('/api/stops/search?term=Sa')
//       .then(res => res.json())
//       .then(stops => this.setState({ stops }));
//   }  
  
//   render() {
//     const { stops } = this.state;
    
//     return (
//       <div className="App">
//         <header className="App-header">
//           <h1 className="App-title">Welcome to Departures</h1>
//         </header>
//         <ul>
//         {stops.map((stop, index) =>
//                 <li key={index}>
//                   {stop.stop_name}
//                 </li>
//                 )}
//         </ul>
//       </div>
//     );
//   }
// }

// export default App;

import React, { Component } from 'react';

//import GithubCorner from 'react-github-corner';
import Autosuggest from 'react-autosuggest';
//import axios from 'axios';
//var strftime = require('strftime');



/* ----------- */
/*    Utils    */
/* ----------- */

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function convertHourMinute(value) {
    // const date = new Date(value);
    // if (date) {
    //     return strftime('%H:%M', date);
    // }
    // else {
    //     return '?'
    // }
    return value.split(":").slice(0,2).join(":")
    
}

// function checkDepartureDelay(datePlannedStr, dateRealStr) {
//     const datePlanned = new Date(datePlannedStr),
//         dateReal = new Date(dateRealStr);
//     const delay = dateReal - datePlanned;
//     var ONE_MINUTE = 60 * 1000; /* ms */
//     if (delay < ONE_MINUTE) {
//         return {
//             isDelayed: false,
//             time: 0
//         }
//     }
//     else {
//         const output = Math.floor(delay / ONE_MINUTE);
//         return {
//             isDelayed: true,
//             time: output
//         }
//     }

// }

// function styleTransitType(departureTransitType) {
//     switch (departureTransitType.toLowerCase()) {
//         case 'ubahn':
//             return {
//                 cssClass: 'ubahn',
//                 symbolStr: 'fa-train'
//             };
//         case 'tram':
//             return {
//                 cssClass: 'tram',
//                 symbolStr: 'fa-subway'
//             };
//         case 'bus':
//             return {
//                 cssClass: 'bus',
//                 symbolStr: 'fa-bus'
//             };
//         default:
//             return {
//                 cssClass: 'bus',
//                 symbolStr: 'fa-bus'
//             };
//     }
// }

/* ----------------- */
/*    Suggestions    */
/* ----------------- */

const renderInputComponent = inputProps => (
    <div className="input-group">
        <div className="input-group-prepend">
            <div className="input-group-text">
                <i className="fa fa-search"></i>
            </div>
        </div>
    <input {...inputProps} />
  </div>
)

const getSuggestionValue = suggestion => suggestion.stop_name;

const renderSuggestion = suggestion => (
    <div>
    {suggestion.stop_name}
  </div>
);

const shouldRenderSuggestions = value => value.trim().length > 2;

class SearchStopField extends Component {
    constructor() {
        super();

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: '',
            suggestions: [],
            isLoading: false
        };
        // this.onSuggestionSelected = this.onSuggestionSelected.bind(this) ????
    }

    onSuggestionSelected = (event, { suggestion }) => {
        //Send id VGNKennung to Parrent console.log(suggestion);
        this.props.handleNewSelectedStop(suggestion.stop_id);
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    getStopArray(name) {

        this.setState({
            isLoading: true
        });

      var getUrl = window.location;
      var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
      var url = new URL("/api/stops/search", baseUrl),
         params = { term: name }
       Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
          fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        suggestions: result.slice(0, 15),
                        isLoading: false
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.error(error);
                }
            );
    }



    getSuggestions(value) {
        const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
        const inputLength = inputValue.length;

        // return inputLength === 0 ? [] : tempResponse.filter(haltestelle =>
        //   haltestelle.Haltestellenname.toLowerCase().slice(0, inputLength) === inputValue
        // );
        if (inputLength === 0) {
            this.setState({
                suggestions: []
            });
        }
        else {
            this.getStopArray(inputValue);
        }
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.getSuggestions(value)
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions, isLoading } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Search for stops',
            value,
            className: 'form-control',
            onChange: this.onChange,
        };


        //
        // Finally, render it!
        return (
            <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          shouldRenderSuggestions={shouldRenderSuggestions}
          renderInputComponent={renderInputComponent}
        />
      <LoadingSpinner isLoading={isLoading} />
      </div>
        );
    }
}
class LoadingSpinner extends Component {
    render() {
        const isLoading = this.props.isLoading;
        if (isLoading) {
            return (
                <i className="fa fa-spinner fa-pulse" id="loadingSpinner"></i>
            )
        }
        else {
            return null
        }
    }
}
/* ----------------- */
/*    logo    */
/* ----------------- */
// class Filler extends Component {
//   render () {
//     return (
//       <div><img src={this.props.url} alt={this.props.alt} className="img-fluid" id="headerImage"/></div>
//     )
//   }
// }
/* ----------------- */
/*    Departures    */
/* ----------------- */

class DepartureTable extends Component {

    render() {
        const rows = [];
        const departures = this.props.departures;

        departures.forEach((item, index) => {
            rows.push(
                <DepartureRow
            departureTime={convertHourMinute(item.departure_time)}
            departureDirection={item.trip.trip_headsign}
            key={index}/>
            )
        })
        if (departures.length < 1) {
            return null
        }
        else {
            return (
                <div className="deapartureContainer">
            <table className="table table-striped<">
              <thead>
                <th>Time</th>
                <th>Line</th>
                <th>Direction</th>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
            )
        }

    }
}

// class LineTransitTypeComponent extends Component {
//     render() {
//         const departureLine = this.props.departureLine,
//             departureTransitType = this.props.departureTransitType;
//         const typeStyles = styleTransitType(departureTransitType);

//         return (
//             <td>
//         <span className="departureTransitType"><i className={'fa ' + typeStyles.symbolStr} aria-hidden="true"></i>
//         <span className={'departureLine '+ typeStyles.cssClass}>{departureLine}</span></span>
//       </td>
//         )
//     }
// }

class DepartureRow extends Component {

    render() {
        return (
            <tr className="departureRow">
          <td>
            <span className="departureTime">{this.props.departureTime}</span></td>
            <td></td>
            <td><span className="departureDirection">{this.props.departureDirection}</span></td>
        </tr>
        )
    }
}

class DepartureComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departures: [],
            //stop_id: 0,
            loadingDepartures: false
        };
        this.handleNewSelectedStop = this.handleNewSelectedStop.bind(this);
    }

    getDepartureArray(stop_id) {

        this.setState({
            loadingDepartures: true
        });

        const url = "/api/stops/" + stop_id + "/departures"
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              //SET state
              this.setState({
                loadingDepartures: false,
                departures: result
              })
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.error(error);
            }
          );
        
        // // axios({
        // //         method: 'get',
        // //         baseURL: 'https://start.vag.de/dm/api/abfahrten.json/vgn',
        // //         url: '/' + stop_id.toString(),
        // //     })
        // //     .then(
        // //         (result) => {
        // //             //SET state
        // //             this.setState({
        // //                 loadingDepartures: false,
        // //                 departures: result.data.Abfahrten
        // //             })
        // //         },
        // //         // Note: it's important to handle errors here
        // //         // instead of a catch() block so that we don't swallow
        // //         // exceptions from actual bugs in components.
        // //         (error) => {
        // //             console.error(error);
        // //         }
        //     );
    }

    handleNewSelectedStop(stop_id) {
        this.getDepartureArray(stop_id);
    }

    toggleButton() {
        this.setState(prevState => ({
            button: !prevState.button
        }));
    }


    render() {
        const departures = this.state.departures;
        return (
            <div className="departureComponent">
            <SearchStopField handleNewSelectedStop={this.handleNewSelectedStop} />
            <DepartureTable departures={departures}/>
            <LoadingSpinnerBig show={this.state.loadingDepartures} />
          </div>
        )
    }
}

class LoadingSpinnerBig extends Component {
    render() {
        const spinner = (
            <div className="LoadingSpinnerContainer">
        <i className="fa fa-3x fa-pulse fa-spinner" aria-hidden="true"></i>
        <span className="sr-only">Loading...</span>
      </div>
        );
        return (this.props.show ? spinner : null);
    }
}

class App extends Component {
    render() {
        return (
            <div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="contentContainer">
                <h2>Departure Monitor <small className="nowrap">for VAG Nürnberg</small> </h2>
                <DepartureComponent />
              </div>
            </div>
          </div>
    		</div>
    	</div>
        )
    }
}


export default App;