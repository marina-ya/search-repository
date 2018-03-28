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
      errorMessage: "",
      dublicateMessage: "",
      id: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  componentWillMount() {
    this.setState({
      searchResults: JSON.parse(localStorage.getItem("searchResults")) || []
    });
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
          id: firstItem.id,
          rating: rating
        };
        this.updateSearchResults(searchResult);
      })
      .catch(error => {
        this.setState({ errorMessage: "No repository found" });
      });
  }

  updateSearchResults(searchResult) {
    let isNewResult = true;

    let updateValues = this.state.searchResults.forEach((item, i) => {
      if (item.id == searchResult.id) {
        isNewResult = false;
        this.state.searchResults.splice(i, 1, searchResult);
        this.setState({ dublicateMessage: "You have such search yet" });
      }
    });

    if (isNewResult) {
      this.setState({
        searchResults: [...this.state.searchResults, searchResult]
      });
    }
    this.emptySearchField();
  }
  emptySearchField() {
    this.setState({
      value: ""
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

  handleClickSubmit(event) {
    this.setState({ errorMessage: "" });
    this.setState({ dublicateMessage: "" });
    this.fetchData();
    event.preventDefault();
  }

  handleRemove(id) {
    let updatedResults = this.state.searchResults.filter(
      item => item.id !== id
    );
    this.setState({ searchResults: updatedResults });

    localStorage.setItem("searchResults", JSON.stringify(updatedResults));
  }

  render() {
    localStorage.setItem(
      "searchResults",
      JSON.stringify(this.state.searchResults)
    );
    let getList = JSON.parse(localStorage.getItem("searchResults"));
    let searchElements = getList.map(result => (
      <li>
        <p>
          <strong>{result.value}</strong>
        </p>
        <p>Language of repository: {result.language} </p>
        <p>Stars rating of repository: {result.starCount} </p>
        <p>Issues opened for repository: {result.issueCount} </p>
        <p>Rating of repository: {result.rating} </p>
        <button onClick={() => this.handleRemove(result.id)}>Delete</button>
      </li>
    ));
    return (
      <div>
        <form onSubmit={this.handleClickSubmit}>
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
        <p>{this.state.dublicateMessage} </p>
        <ul className="search-list">{searchElements}</ul>
      </div>
    );
  }
}

function toJson(response) {
  return response.json();
}

ReactDOM.render(<SearchForm />, document.getElementById("root"));
