import axios from "axios";
import React, { Component } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import Moment from "react-moment";

class Lyrics extends Component {
  state = {
    track: {},
    lyrics: {},
    albums: {},
  };
  componentDidMount() {
    // console.log(this.props.match.params.artist_id);
    const track_request = axios.get(
      `/api/track.lyrics.get?track_id=${this.props.match.params.id}&apikey=${process.env.REACT_APP_MM_KEY}`
    );
    const lyrics_request = axios.get(
      `/api/track.get?commontrack_id=${this.props.match.params.commontrackId}&apikey=${process.env.REACT_APP_MM_KEY}`
    );
    const album_request = axios.get(
      `/api/artist.albums.get?artist_id=${this.props.match.params.artist_id}&apikey=${process.env.REACT_APP_MM_KEY}`
    );

    axios
      .all([track_request, lyrics_request, album_request])
      .then(
        axios.spread((...responses) => {
          this.setState({
            lyrics: responses[0].data.message.body.lyrics,
            track: responses[1].data.message.body.track,
            albums: responses[2].data.message.body.album_list,
          });
          // console.log(responses[2].data);
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  }
  render() {
    const { track, lyrics, albums } = this.state;
    console.log(albums);
    if (
      track === undefined ||
      lyrics === undefined ||
      Object.keys(track).length === 0 ||
      Object.keys(lyrics).length === 0
    ) {
      console.log("something is empty");
      return <Spinner />;
    } else {
      return (
        <React.Fragment>
          <Link to="/" className="btn btn-dark btn-sm mb-4">
            Go Back
          </Link>
          <div className="card">
            <h5 className="card-header">{track.track_name}</h5>
            <div className="card-body">
              <p className="card-text">{lyrics.lyrics_body}</p>
            </div>
          </div>
          <ul className="list-group mt-3">
            <li className="list-group-item">
              <strong>Albums</strong> :{track.album_id}
              <ol>
                {albums.map((value, index) => {
                  return (
                    <li key={index}>
                      Album Name: {"  "}
                      {value.album.album_name}
                    </li>
                  );
                })}
              </ol>
            </li>
            <li className="list-group-item">
              <strong>Genre </strong>:
              {
                track.primary_genres.music_genre_list[0].music_genre
                  .music_genre_name
              }
            </li>
            <li className="list-group-item">
              <strong>Explicit Words</strong>:{" "}
              {track.explicit === 0 ? "No" : "Yes"}
            </li>
            <li className="list-group-item">
              <strong>Release Date</strong> :
              <Moment format="MM/DD/YYYY ">{track.updated_time}</Moment>
            </li>
          </ul>
        </React.Fragment>
      );
    }
  }
}

export default Lyrics;
//   axios
//     .get(
//       `/track.lyrics.get?track_id=${this.props.match.params.id}&apikey=${process.env.REACT_APP_MM_KEY}`
//     )
//     .then((res) => {
//       console.log(res.data);
//       this.setState({ lyrics: res.data.message.body.lyrics });

//       return axios
//         .get(
//           `/track.get?commontrack_id=${this.props.match.params.commontrackId}&apikey=${process.env.REACT_APP_MM_KEY}`
//         )
//         .then((res) => {
//           console.log(res.data);
//           // console.log(this.props.match.params);
//           this.setState({ track: res.data.message.body.track });
//           return axios.get(
//             `artist.albums.get?artist_id=${this.props.match.params.artist_id}&s_release_date=desc&g_album_name=1`
//           ).then()
//     })
//     .catch((err) => console.log(err));
// }
