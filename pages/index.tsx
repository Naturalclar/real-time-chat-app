import * as React from 'react';
import { Component } from 'react';
import { Layout, Chat } from '../components';
import styled from 'styled-components';

const Input = styled.input`
  background: transparent;
  color: #999;
  border: 0;
  border-bottom: 1px solid #666;
  border-radius: 0;
  font-size: 3rem;
  font-weight: 500;
  box-shadow: none !important;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

class IndexPage extends Component<any,any> {
  constructor(props:any) {
    super(props);
    this.state = { user: null }

  }

  handleKeyUp = (evt:any): void => {
    if (evt.keyCode === 13) {
      const user = evt.target.value;
      this.setState({ user });
    }
  }

  render() {
    const { user } = this.state;

    return (
      <Layout pageTitle="Realtime Chat">
        <main className="container-fluid position-absolute h-100 bg-dark">
          <div className="row position-absolute w-100 h-100">
            <section className="col-md-8 d-flex flex-row flex-wrap align-items-center align-content-center px-5">
              <div className="px-5 mx-5">
                <span 
                  className="d-block w-100 h1 text-light"
                  style={{marginTop: 50}}
                >
                {
                  user ?
                    (
                      <span>
                        <span style={{color: '#999'}}>
                          Hello!&nbsp;
                        </span>
                          {user}
                      </span>
                    ):
                    `What is your name?`
                }
                </span>
                {
                  !user &&
                  <Input 
                    type="text" 
                    className="form-control"
                    onKeyUp={this.handleKeyUp}
                    autoComplete="off"
                  />
                }
              </div>
            </section>
            <section className="col-md-4 position-relative d-flex flex-wrap h-100 align-items-start align-content-between bg-white px-0">
                { user && <Chat activeUser={user} />}
            </section>
          </div>
        </main>
      </Layout>
    )
  }
}

export default () => (
  <IndexPage />
)