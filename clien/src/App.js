import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

export class App extends Component {
  state = {
    profileImg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    profileImg2: '',
    loading: 0,
    err: 'The processed image will be shown here'
  }
  imageHandler = (e) => {
    this.setState({ loading: 1 })
    this.setState({ profileImg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', profileImg2: '', err: 'The processed image will be shown here' })
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        const formdata = new FormData();
        formdata.append('file', e.target.files[0]);

        await axios.post('https://imgsegbackend.herokuapp.com/uploadimg', formdata).then(res => {
          if (res.data.data == "") {
            this.setState({ err: res.data.status })
            this.setState({ loading: 2 })
          }
          else {
            this.setState({ profileImg2: res.data })
            this.setState({ profileImg: reader.result })
            this.setState({ loading: 0 })
          }
        }).catch(e => {
          this.setState({ err: 'The size of image is larger than 256*256' });
          this.setState({ loading: 2 });
        })
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  };
  render() {
    const { profileImg, profileImg2, loading, err } = this.state
    return (
      <div className="page" style={{ display: "flex", flexDirection: "column" }} >
        <div style={{ width: "500px", display: "flex", flexDirection: "row", alignContent: "stretch" }} >
          <div style={{ alignContent: "flex-start" }} >
            <h2 className="heading">Initial Image</h2>
            <div className="img-holder">
              <img src={profileImg} alt="" id="img" className="img" />
            </div>
          </div>
          <div style={{ marginLeft: "150px", alignContent: "flex-end" }} >
            <h2 className="heading">Final Image</h2>
            <div className="img-holder">
              <img className="img" src={`data:image/jpeg;charset=utf-8;base64,${profileImg2}`} alt={err} />
            </div>
          </div>
        </div>
        {loading == 1 ?
          <p><img src={"./loading.png"}></img></p>
          :
          <div className="container">
            <input type="file" accept="image/*" name="image-upload" id="input" onChange={this.imageHandler} />
            <div className="label" style={{ alignContent: "center" }}>
              <br />
              <label className="image-upload" htmlFor="input" style={{ marginTop: "5px" }}>
                Choose your Photo
              </label>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;