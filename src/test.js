import React from "react";
import ReactDOM from "react-dom";
//import axios from "axios";
import "./index.css";

// Make a request for a user with a given ID
//stargazers_count
/*axios
  .get("https://api.github.com/search/repositories?q=react")
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });*/

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", starCount: 0 };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    fetch(`https://api.github.com/search/repositories?q=${this.state.value}`)
      .then(toJson)
      .then(function(myJson) {
        const firstItem = myJson.items[0];
        let rating =
          Math.round(firstItem.stargazers_count / firstItem.open_issues * 100) /
          100;
        //  this.state.starCount =firstItem.stargazers_count;
        console.log(
          `Found repository ${firstItem.name}: ${firstItem.stargazers_count}, ${
            firstItem.open_issues
          }, ${rating}`
        );
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <p>Stars rating of repository: </p>
      </div>
    );
  }
}

function toJson(response) {
  return response.json();
}

ReactDOM.render(<SearchForm />, document.getElementById("root"));
