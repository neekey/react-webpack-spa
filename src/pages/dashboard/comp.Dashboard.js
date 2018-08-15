import React from 'react';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      posts: null,
      loadingError: null,
    };
    this.loadPosts.bind(this);
  }
  componentDidMount() {
    this.loadPosts();
  }

  loadPosts() {
    this.setState({
      isLoading: true,
    });
    const req = new XMLHttpRequest();
    req.addEventListener('load', res => {
      const currentTarget = res.currentTarget;
      if (currentTarget.status === 200) {
        const posts = JSON.parse(currentTarget.responseText);
        this.setState({ posts, isLoading: false });
      } else {
        this.setState({ loadingError: currentTarget, isLoading: false });
      }
    });
    req.open('GET', 'https://jsonplaceholder.typicode.com/posts');
    req.send();
  }

  render() {
    if (this.state.loadingError) {
      return <div>There's something wrong!</div>;
    } else if (this.state.isLoading || !this.state.posts) {
      return <div>Loading posts ...</div>;
    } else if (this.state.posts.length) {
      return (
        <ul>
          {this.state.posts.map(({ id, title, body }) => (
            <li key={id}>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      );
    }
    return <div>There's no post yet</div>;
  }
}
