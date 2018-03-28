import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import "./index.css";

const Wrapper = styled.section`
  color: #8a8a8a;
  font-family: "Lato", sans-serif;
`;
const WrapperSearch = styled.section`
  padding: 14px;
  border-bottom: 1px solid #e7e7e7;
  border-top: 1px solid #e7e7e7;
  background-color: #fff;
  padding: 30px 4% 20px;
  margin: 2% 0;
  form {
    margin-bottom: 10px;
  }
`;
const Header = styled.h1`
  color: #16253c;
  font-size: 20px;
  margin-bottom: 10px;
`;
const Button = styled.button`
  background:#DB7093 ;
  color:white ;
  font-size: 16px;
  margin: 16px;
  padding: 4px 16px;
  border: 2px solid #DB7093;
  border-radius: 6px;
  outline: none;
  font-family: "Lato", sans-serif;
  font-weight:bold;
  transition: all 0.3s ease 0s;
 
  &:hover {
    background:white ;
      color: #DB7093 ;  
}
&:active { transform: translateY(2px); }
  }
`;
const ButtonClose = styled.button`
  cursor: pointer;
  color: #fff;
  border-radius: 30px;
  background: #db7093;
  font-size: 31px;
  font-weight: bold;
  position: absolute;
  line-height: 0px;
  padding: 13px 5px;
  top: -10px;
  right: -10px;
  border: none;
  outline: none;
  font-weight: normal;
  transition: all 0.3s ease 0s;
  &:before {
    content: "×";
  }
  &:hover {
    padding: 15px 7px;
    top: -12px;
    right: -12px;
  }
  &:active { transform: translateY(2px); }
  }
`;
const Input = styled.input`
  color: #555;
  padding: 6px;
  margin: 6px;
  background: white;
  border: 2px solid #db7093;
  border-radius: 6px;
  outline: none;
  font-family: "Lato", sans-serif;
  width: 12%;
  min-width: 225px;
`;
const SearchElements = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  align-items: stretch;
  align-content: stretch;

  li {
    opacity: 0.9;
    width: 20%;
    margin: 1%;
    padding: 1%;
    list-style: none;
    background: white;
    border-radius: 10px;
    min-width: 150px;
    position: relative;

    p {
      margin-bottom: 15px;
    }
    strong {
      color: #263750;
    }
  }
`;

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

    this.state.searchResults.forEach((item, i) => {
      if (item.id === searchResult.id) {
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
    let getList = this.Storage();
    let searchElements = getList.map(result => (
      <li key={result.id}>
        <p>
          <strong>{result.value}</strong>
        </p>
        <p>Language of repository: {result.language} </p>
        <p>Stars rating of repository: {result.starCount} </p>
        <p>Issues opened for repository: {result.issueCount} </p>
        <p>Rating of repository: {result.rating} </p>
        <ButtonClose onClick={() => this.handleRemove(result.id)} />
      </li>
    ));
    return (
      <Wrapper>
        <WrapperSearch>
          <Header>Search for repository</Header>
          <form onSubmit={this.handleClickSubmit}>
            <label>
              <Input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
              />
            </label>
            <Button type="submit" value="Search">
              Search
            </Button>
          </form>
          <p>{this.state.errorMessage} </p>
          <p>{this.state.dublicateMessage} </p>
        </WrapperSearch>

        <SearchElements>{searchElements}</SearchElements>
      </Wrapper>
    );
  }

  Storage() {
    localStorage.setItem(
      "searchResults",
      JSON.stringify(this.state.searchResults)
    );
    let getList = JSON.parse(localStorage.getItem("searchResults"));
    return getList;
  }
}

function toJson(response) {
  return response.json();
}

ReactDOM.render(<SearchForm />, document.getElementById("root"));
