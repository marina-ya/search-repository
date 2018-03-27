import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      value: "",
      starCount: 0,
      issueCount: 0,
      rating: 0,
      language: "none",
      errorMessage: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  fetchData() {
    fetch(`https://api.github.com/search/repositories?q=${this.state.value}`)
      .then(toJson)
      .then(data => {
        const firstItem = data.items[0];
        let rating = this.ratingCalulate(firstItem);
        let searchResult = {
          value: this.state.value,
          starCount: firstItem.stargazers_count,
          issueCount: firstItem.open_issues,
          language: firstItem.language == null ? "none" : firstItem.language,
          rating: rating
        };
        this.setState({
          searchResults: this.state.searchResults.concat([searchResult])
        });
      })
      .catch(error => {
        this.setState({ errorMessage: "No repository found" });
      });
  }
  ratingCalulate(firstItem) {
    return (firstItem.stargazers_count && firstItem.open_issues) > 0
      ? Math.round(firstItem.stargazers_count / firstItem.open_issues * 100) /
          100
      : 0;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ errorMessage: "" });
    this.fetchData();
    event.preventDefault();
  }

  render() {
    let searchElements = this.state.searchResults.map(result => (
      <li key={result.id}>
        <p>
          <strong>{result.value}</strong>
        </p>
        <p>Language of repository: {result.language} </p>
        <p>Stars rating of repository: {result.starCount} </p>
        <p>Issues opened for repository: {result.issueCount} </p>
        <p>Rating of repository: {result.rating} </p>
      </li>
    ));

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
          <input type="submit" value="Search" />
        </form>
        <p>{this.state.errorMessage} </p>
        <ul className="search-list">{searchElements}</ul>
      </div>
    );
  }
}

function toJson(response) {
  return response.json();
}

ReactDOM.render(<SearchForm />, document.getElementById("root"));
